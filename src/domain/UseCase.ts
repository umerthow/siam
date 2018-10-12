import { Database, 
        Translation, 
        LoggerInterface, 
        EventLogger, 
        Validator, 
        DBResponseInterface} from '../infrastructures/Interfaces'

export interface UseCaseContructor {
    database    : Database
    logger      : LoggerInterface
    eventLog    : EventLogger
    translator  : Translation
    validator   : Validator
    config      : any
}

export interface UseCaseInterface {
    create<T>(params: any): Promise<T>
    getBy(params: any, scope?: string): any
    fetchBy(params: any): any
    update(item: any, newData: any): Promise<DBResponseInterface>
    hardDelete?(id: number): Promise<any>
    softDelete(id: number): Promise<any>
    validate(params: any): any
    fetchAll(page: number, sort?: string, sortColumn?: string, where?: any): Promise<DBResponseInterface>
}

export default class UseCase {
    protected e: Translation
    protected config: any
    protected provider: Database
    protected logger: LoggerInterface
    protected eventLog: EventLogger
    protected validator: Validator
    
    constructor(protected parameters: UseCaseContructor) {
        this.provider   = parameters.database
        this.config     = parameters.config
        this.logger     = parameters.logger
        this.eventLog   = parameters.eventLog
        this.e          = parameters.translator
        this.validator  = parameters.validator
    }

    protected response(msg: any, error?: Boolean, data?: any): DBResponseInterface {
        error = error === undefined ? true : error
        data = data === undefined ? null: data

        return {
            error: error,
            data: data, 
            msg: msg
        }
    }

}
