import { UseCaseContructor, DBResponseInterface } from '../../infrastructures/Interfaces'
import PermMapping from './PermMapping'
// import PermEntity from './PermEntity'

import { Sequelize } from 'sequelize-typescript'

import UseCase, {UseCaseInterface} from '../UseCase'

export default class PermUseCase extends UseCase implements UseCaseInterface {
    private mapping: PermMapping
    constructor(protected parameters: UseCaseContructor) {
        super(parameters)

        const mappingParams = {
            logger: parameters.logger,
            config: parameters.config,
            validator: parameters.validator,
            translator: parameters.translator
        }

        this.mapping = new PermMapping(mappingParams)
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

        page = page || 1
        // let attributes: any = ['id', 'label', 'status', 'created_at', 'updated_at']
        // let offset = page ? (this.config.perPage * page) - this.config.perPage : 0 || 0
        // offset = offset < 0 ? 0 : offset
        
        // let col = column || 'created_at'
        // sort = sort || 'ASC'
        // sort = sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC'

        // let order = [[col, sort]]
        // let limit = this.config.perPage

        let result: DBResponseInterface
        try {
            // result = await this.provider.fetchAll({offset, limit, where, attributes, order})
            result = await this.provider.fetchAll({})
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

        let attributes = [[Sequelize.fn('count',  Sequelize.col('id')), 'count']]
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
        return { error: false, data: params, msg: ''} 
    }

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
        return this.response('Data Perm Not Found')
    }

    

    public async getBy(params: any): Promise<DBResponseInterface> {
        params
        return {} as DBResponseInterface
    }

    public async update(params: any): Promise<DBResponseInterface> {
        params
        return {} as DBResponseInterface
    }

    public async softDelete(params: any): Promise<DBResponseInterface> {
        params
        return {} as DBResponseInterface
    }

    public async validate(params: any): Promise<DBResponseInterface> {
        params
        return {} as DBResponseInterface
    }

    public async getByPath(controller: string, action:string) {
        return {controller, action, perm: 0x08}
    }

    public async create<DBResponseInterface>(params: any): Promise<DBResponseInterface> {
        params
        return {} as DBResponseInterface
    }
}