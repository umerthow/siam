import UseCase from '../UseCase'
import { UseCaseContructor, DBResponseInterface } from '../../infrastructures/Interfaces'

import ResetEntity from './ResetEntity'
import ResetMapping from './ResetMapping'


export class ResetUseCase extends UseCase {
    protected mapping: ResetMapping

    constructor(protected parameters: UseCaseContructor) {
        super(parameters) 
        const mappingParams = {
            logger: parameters.logger,
            config: parameters.config,
            validator: parameters.validator,
            translator: parameters.translator
        }
        this.mapping = new ResetMapping(mappingParams)
    }

    fetchAll(page: number, sort?: string, sortColumn?: string, where?: any): any {}

    /**
     * Fetch data from provider by a condition
     * 
     * @param params 
     */
    public async getBy(params: any): Promise<ResetEntity | Boolean> {
        let token = this.mapping.clean(params.token)
        params.token = token
        let result = await this.provider.fetchOne({where: params})
        if(result) {
            return this.mapping.build(result)
        }
        return false
    }


    public async fetchBy() {}


    /**
     * Create or Save Data
     * 
     * @param params Data from Request
     */
    public async create<DBResponseInterface>(params : any) : Promise<DBResponseInterface> {
        let reset: ResetEntity = this.mapping.build(params)

        let data = this.mapping.toObj(reset)
        delete data.id
        delete data.confirmed_at
        
        return this.provider.save(data)
    }
    

    /**
     * Update data
     * 
     * @param item 
     */
    public async update(item: any): Promise<DBResponseInterface> {
        let data = this.mapping.toObj(item)
        if (data.id) {
            return this.provider.update(data)
        }
        return this.response('Data not found')
    }

    public async softDelete() {}
    validate(params: any): any {}
}