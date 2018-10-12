import UseCase, { UseCaseInterface } from '../UseCase'
import { UseCaseContructor,
        ReturnMessage,
        DBResponseInterface,
        ValidationResponseInterface } from '../../infrastructures/Interfaces'
import { Encryption } from '../../infrastructures/Encryptor'

import RoleModel from '../../models/Role.model'

import UserEntity from './UserEntity'
import UserMapping from './UserMapping'
import { Sequelize } from 'sequelize-typescript'

export interface UserUseCaseInterface extends UseCaseInterface {
    generatePassword(password: string, salt: string): any
    getByUsername(username: string): any
}

export class UserUseCase extends UseCase implements UserUseCaseInterface {
    protected mapping: UserMapping

    constructor(protected parameters: UseCaseContructor, protected encryption: Encryption) {
        super(parameters) 
        this.encryption = encryption

        const mappingParams = {
            logger: parameters.logger,
            config: parameters.config,
            validator: parameters.validator,
            translator: parameters.translator
        }
        this.mapping = new UserMapping(mappingParams)
    }


    /**
     * Fetch User account for authentication
     * 
     * @param params 
     */
    public async getByUsername(username: string) {
        username = this.mapping.clean(username)
        let query = {email: username}
        let result = await this.provider.fetchOne({where: query, include: RoleModel})
        if(result) {
            return this.mapping.build(result)
        }
        return false
    }

    
    /**
     * Get Data by custom condition
     * @param params 
     * @param scope : 
     *      Scope return object [ safe | bare | entity ] default is 'safe'
     *      - `safe` mean the object will keep sensitif data such as Password and salt
     *      - `bare` mean object will expose sensitif data
     *      - `entity` mean object will expose senitif data but using EntityFormat instead of Plain Object
     */
    public async getBy(params: any, scope?: string) {
        scope = scope || 'safe'

        return this.fetchBy(params, scope)
    }


    /**
     * Fetch Data by Custom Condition
     * 
     * @param params 
     */
    public async fetchBy(params: any, scope?: string): Promise<DBResponseInterface> {
        if (params) {
            let result = await this.provider.fetchOne({ where: params, include: RoleModel })
            if (result) {
                let item: any = this.mapping.build(result) 
                if(scope === 'entity') {
                    return this.response('', false, item)
                } else if (scope === 'bare') {
                    return this.response('', false, this.mapping.toObj(item))
                } 
                return this.response('', false, this.mapping.scopeResponse(item))
            }
        }
        return this.response('')
    }

    /**
     * Create or Save Data
     * 
     * @param params Data from Request
     */
    public async create<DBResponseInterface>(params : any) : Promise<DBResponseInterface> {
        let user: UserEntity = this.mapping.build(params)
        
        const salt = this.encryption.genSalt()
        const hash = this.encryption.encrypt(user.password, salt)

        user.password = hash
        user.salt = salt

        let data = this.mapping.toObj(user)
        delete data.id
        delete data.deleted_at
        delete data.last_login

        return this.provider.save(data)
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
     * Fetch All Item with parameters
     * 
     * @param page 
     * @param limit 
     * @param where 
     */
    public async fetchAll<DBResponseInterface>(
            page: number, 
            sort?: string, 
            sortColumn?: string, 
            where?: any): Promise<any | Boolean>  {

        let attributes: any = ['id', 'first_name', 'last_name','email', 'phone', 'role_id', 'last_login', 'created_at', 'updated_at']
        let offset = page ? (this.config.perPage * page) - this.config.perPage : 0 || 0
        offset = offset < 0 ? 0 : offset

        let col = sortColumn || 'id'
        sort = sort ? sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC' : 'ASC'

        let order = [[col, sort]]
        let limit = this.config.perPage
        
        let users = await this.provider.fetchAll({offset, limit, where, attributes, order})
        
        if(users.data) {
            users.data = users.data.map( (user: any) => {
                let item: any = {}
                user.attributes.map( (key: any) => {
                    item[key] = user.get(key)
                }) 
                item = this.mapping.build(item)
                return this.mapping.scopeResponse(item)
            })
        }

        attributes = [[Sequelize.fn('count',  Sequelize.col('id')), 'count']]
        let item: any = await this.provider.fetchAll({
            attributes: attributes
        })

        let count = item.data[0].get('count')
        let params = {
            users: users ? users.data : [],
            total_items: count,
            total_pages: Math.ceil(count / this.config.perPage)
        }
        return { error: false, data: params, msg: ''} 
    }


    /**
     * Password Generator
     * 
     * @param password 
     * @param salt 
     */
    public async generatePassword(password: string, salt: string) {
        return this.encryption.encrypt(password, salt)
    }

    /**
     * Update Object
     * 
     * @param user : UserEntity 
     * @param data : New Data
     */
    public async update(user: any, data: any): Promise<DBResponseInterface> {
        if (user instanceof UserEntity) {
            user = this.mapping.toObj(user)
        }
        
        let validation: ValidationResponseInterface = this.mapping.validate(data)
        if(validation.error) {
            return this.response(validation.msg)
        }
        for(let key in data) {
            user[key] = data[key]
        }

        if (user.id) {
            try {
                return this.provider.update(user)
            } catch(err) {
                return this.response(err)
            }
        }
        return this.response('')
    }

    /**
     * Soft Delete Use by ID
     * 
     * @param id 
     */
    public async softDelete<DBResponseInterface>(id: number): Promise<DBResponseInterface | Boolean> {
        let user: any = await this.provider.fetchOne({where: {id}})
        if(user) {
            let obj: any = {}
            user.attributes.map( (key: any) => {
                obj[key] = user.get(key)
            })
            obj.deleted_at = Date.now()
            return this.provider.update(obj)
        }
        return false
    }
}
