/**
 * Role UseCase is the core of Application business and every methods that called from outside 
 * must return as DBResponseInterface
 * 
 * Sept 22th, 2018
 * Verri Andriawan <verri [at] tiduronline.com>
 */

import UseCase, { UseCaseInterface } from '../UseCase'
import { UseCaseContructor,
        ReturnMessage,
        DBResponseInterface,
        ValidationResponseInterface } from '../../infrastructures/Interfaces'

import RoleEntity from './RoleEntity'
import RoleMapping from './RoleMapping'
import { Sequelize } from 'sequelize-typescript'


export interface RoleUseCaseInterface extends UseCaseInterface {
    addPermission(id: number, nperm: number): Promise<DBResponseInterface>
    removePermission(id: number, nperm: number): Promise<DBResponseInterface>
}

export class RoleUseCase extends UseCase implements RoleUseCaseInterface {
    protected mapping: RoleMapping

    constructor(protected parameters: UseCaseContructor) {
        super(parameters) 
        
        const mappingParams = {
            logger: parameters.logger,
            config: parameters.config,
            validator: parameters.validator,
            translator: parameters.translator
        }
        this.mapping = new RoleMapping(mappingParams)
    }



    /**
     * Create or Save new Role
     * @param params 
     */
    public async create<DBResponseInterface>(params: any): Promise<DBResponseInterface> {
        let role: RoleEntity = this.mapping.build(params)
        let data = this.mapping.toObj(role)
        delete data.id
        return this.provider.save(data)
    }


    public async getBy(params: any) {}

    /**
     * Fetch Data from DB Storage
     * 
     * @param params 
     * @return DBResponseInterface
     */
    public async fetchBy(params: any): Promise<DBResponseInterface> {
        if (params) {
            let result = await this.provider.fetchOne({ where: params })
            if (result) {
                let item: any = this.mapping.build(result)
                item = this.mapping.toObj(item)
                return this.response(null, false, item)
            }
        }
        return this.response('Data Not Found')
    }

    
    /**
     * Validation All request data
     * 
     * @param params Data from Request 
     */
    validate(params: any) : ReturnMessage {
        return this.mapping.validate(params)
    }


    /**
     * Fetch All Item and filter those items by parameters
     * 
     * @param page 
     * @param limit 
     * @param where 
     */
    public async fetchAll(
            page: number, 
            sort?: string, 
            column?: string, 
            where?: any): Promise<DBResponseInterface>  {

        let attributes: any = ['id', 'label', 'description', 'perms', 'status', 'created_at', 'updated_at']
        let offset = page ? (this.config.perPage * page) - this.config.perPage : 0 || 0
        offset = offset < 0 ? 0 : offset
        
        let col = column || 'created_at'
        sort = sort || 'ASC'
        sort = sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC'

        let order = [[col, sort]]
        let limit = this.config.perPage

        let result: DBResponseInterface
        try {
            result = await this.provider.fetchAll({offset, limit, where, attributes, order})
        } catch(err) {
            return this.response(err)
        }

        let roles = result.data
        if(roles && roles.length > 0) {
            roles = roles.map( (role: any) => {
                let item: any = {}
                role.attributes.map( (key: any) => {
                    item[key] = role.get(key)
                })

                item = this.mapping.build(item)
                return this.mapping.toObj(item)
            })
        }

        attributes = [[Sequelize.fn('count',  Sequelize.col('id')), 'count']]
        try { 
            result = await this.provider.fetchAll({
                attributes: attributes
            })
        } catch(err) {
            return this.response(err)
        }

        let item = result.data
        let count = item ? item[0].get('count'): 0
        let params = {
            item: roles || [],
            total_items: count,
            total_pages: Math.ceil(count / this.config.perPage)
        }
        return { error: false, data: params, msg: '' } 
    }

    /**
     * Update Object
     * @param data 
     * @return DBResponseInterface
     */
    public async update(role: any, data: any): Promise<DBResponseInterface> {
        if(role instanceof RoleEntity) {
            role = this.mapping.toObj(role)
        }
        let validation: ValidationResponseInterface = this.mapping.validate(data)
        if(validation.error) {
            return this.response(validation.msg)
        }

        for(let key in data) {
            role[key] = data[key]
        }

        if (role.id) {
            try {
                return this.provider.update(role)
            } catch(err) {
                return this.response(err)
            }
        }
        return this.response('')
    }


    /**
     * Soft Delete Use by ID
     * 
     * @param id : Role ID
     */
    public async softDelete<DBResponseInterface>(id: number): Promise<DBResponseInterface | Boolean> {
        let role: any = await this.provider.fetchOne({where: {id}})
        if(role) {
            let obj: any = {}
            role.attributes.map( (key: any) => {
                obj[key] = role.get(key)
            })
            obj.deleted_at = Date.now()
            return this.provider.update(obj)
        }
        return false
    }


    /**
     * Add new Permission to Role by Permission Integer
     * 
     * @param id    : Role ID
     * @param perm  : New Permission Integer
     * @return DBResponseInterface
     */
    public async addPermission(id: number, perm: any): Promise<DBResponseInterface> {
        let result = await this.provider.fetchOne({where: {id}})
        if(!result) {
            return this.response('Data role not found')
        }
        let role: any = this.mapping.build(result)
        let newPerms = role.perms | perm.perm

        role = this.mapping.toObj(role)
        role.perms = newPerms
        
        result = await this.provider.update(role)
        if(result) {
            return this.response('', false, perm)
        }

        return this.response('Failed to update role permission')
    }



    /**
     * Release Permission from Role by Permission Integer
     * 
     * @param id    : Role ID
     * @param perm  : New Permission Integer
     * @return DBResponseInterface
     */
    public async removePermission(id: number, perm: any): Promise<DBResponseInterface> {
        let result = await this.provider.fetchOne({where: {id}})

        
        if(!result) {
            return this.response('Data role not found')
        }

        let role: any = this.mapping.build(result)
        let newPerms = role.perms > parseInt(perm.perm) ? role.perms - parseInt(perm.perm) : 0 

        role = this.mapping.toObj(role)
        role.perms = newPerms

        result = await this.provider.update(role)
        if(result) {
            return this.response('', false, perm)
        }

        return this.response('Failed to update role permission')
    }

}
