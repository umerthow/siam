import RoleServiceInterface from '../infrastructures/interface/role.service.interface'
import ResponseInterface  from '../infrastructures/interface/response.interface'
import { UseCaseInterface } from '../domain/UseCase'
import Service, { ServiceConstructorInterface } from './Service'
import { DBResponseInterface, ReturnMessage } from '../infrastructures/Interfaces'
import { UserUseCaseInterface } from '../domain/User/UserUseCase'
import { RoleUseCaseInterface } from '../domain/Role/RoleUseCase' 

export default class RoleService extends Service implements RoleServiceInterface {

    constructor(
            private roleProvider: RoleUseCaseInterface,
            private userProvider: UserUseCaseInterface,
            private permProvider: UseCaseInterface,
            protected parameters: ServiceConstructorInterface
        ) {
        super(parameters)
    }


    /**
     * Fetch All data and filter method
     *
     * @param params
     */
    public async fetchAll(params: any): Promise<ResponseInterface> {
        let page = params.page
        let sort = params.sort
        let column = params.column

        let result = await this.roleProvider.fetchAll(page, sort, column)
        return this.response('200', result.data, null)
    }


    /**
     * Fetch Role by Custom Condition
     * @param params
     * @return ResponseInterface
     */
    public async fetchBy(params: any): Promise<ResponseInterface> {
       
        let result = await this.roleProvider.fetchBy({id: params.id})
        let msg = ''

        if (result.error) {
            msg = this.e.translate('role.errors.not_found', 'Role doesn\'t exists yet')
            return this.response('404', null, msg)
        }

        let role = result.data

        result = await this.permProvider.fetchAll(-1)
        let permissions: any = []
        if (!result.error) {
            result.data.item.map( (key: any) => {
                if (role.perms & key.perm) {
                    permissions.push( {
                        id: key.id,
                        controller: key.controller,
                        action: key.action
                    })
                }
            })
        }
        
        role.access_granted = permissions
        role.all_access = result.data.item
        return this.response('200', role, '')
    }

    /**
     * Delete item
     * @param params
     * @return ResponseInterface
     */
    public async delete(params: any): Promise<ResponseInterface> {
        let data = params.body
        let result: DBResponseInterface
        let msg = this.e.translate('role.errors.not_found', 'Role doesn\'t exists yet')
        if (!data.id) return this.response('403', null, msg)

        result = await this.userProvider.fetchBy({role_id: parseInt(data.id)})
        if (!result.error) {
            msg = this.e.translate('role.errors.role_is_used', 'Failed to delete Role')
            return this.response('403', null, msg)
        }

        result = await this.roleProvider.softDelete(data.id)
        if (result.error) {
            msg = this.e.translate('role.errors.failed_delete', 'Failed to delete Role')
            return this.response('403', null, msg)
        }
        return this.response('200', true, '')
    }


    /**
     * Update User Data
     * @param params
     */
    public async update(id: any, req: any): Promise<ResponseInterface> {
        let data = req.body
        let result: DBResponseInterface = {error: true, data: '', msg: ''}
        result.msg = this.e.translate('role.notify.failed_update', 'Role failed to update')

        id = id ? parseInt(id) : 0
        data.id = data.id ? parseInt(data.id) : 0

        let msg: string
        if (data.id !== id) {
            msg = this.e.translate('role.notify.failed_update', 'Role failed to update')
            this.logger.error(`id is not equal data.id: ${data.id} and query.id: ${id}`)
            return this.response('403', null, msg)
        }

        if (data.id > 0) {
            try {
                result = await this.roleProvider.fetchBy({id: data.id})
            } catch (err) {
                this.logger.error(err)
                msg = this.e.translate('role.errors.not_found', 'Role doesn\'t exists yet')
                return this.response('404', null, msg)
            }
            let role = result.data
            if (role && role.id) {
                try {
                    result = await this.roleProvider.update(role, data)
                } catch (err) {
                    this.logger.error(err)
                    msg = this.e.translate('role.notify.failed_update', 'Role failed to update')
                    return this.response('403', null, msg)
                }

                if (result && !result.error) {
                    msg = this.e.translate('role.notify.success_update', 'Role successfully updated')
                    return this.response('200', true, msg)
                }
            }
        }

        return this.response('403', null, result.msg)
    }

    /**
     * Save new Role data
     * 
     * @param params 
     */
    public async save(params: any): Promise<ResponseInterface> {
        const data = params.data
        data.perms = '0x00'
        
        const errResult: ReturnMessage = this.roleProvider.validate(data)
        if (errResult.msgCode) {
            return this.response('403', null, errResult)
        }

        const response: DBResponseInterface = await this.roleProvider.create<DBResponseInterface>(data)
        if (response.error) {
            this.logger.info(response.msg)
            let msg: ReturnMessage = this.e.translate('role.validation.error_validation', 'Failed to register new')
            return this.response('403', null, msg)
        }
        return this.response('200', response.data, '')
    }


    /**
     * Setting new Permission 
     * 
     * @param params  
     * @param type [ 'release' | 'add' ]
     */
    public async setPermission(params: any, type: string): Promise<ResponseInterface> {
        const roleID = params.data.role_id
        const permID = params.data.perm_id
        let msg = ''

        if (!permID || !roleID) {
            this.logger.error('Role id or Perm ID is undefined')

            msg = this.e.translate('role.error.failed_update_permission', 'Failed to update permission from role')
            return this.response('403', null, msg)
        }

        let result: DBResponseInterface  = await this.permProvider.fetchBy({id: permID})
        
        if(result && result.error) {
            this.logger.error(result.msg)

            msg = this.e.translate('role.error.failed_update_permission', 'Failed to update permission from role')
            return this.response('403', null, msg)
        }
        
        if (type === "release") {
            result = await this.roleProvider.removePermission(roleID, result.data)
        } else {
            result = await this.roleProvider.addPermission(roleID, result.data)
        }
        if(result.error) {
            this.logger.error(result.msg)

            msg = this.e.translate('role.error.failed_update_permission', 'Failed to update permission from role')
            return this.response('403', null, msg)
        }

        return this.response('200', result.data, '')
    }

}