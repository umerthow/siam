import {LoggerInterface, 
        EventLogger, 
        Translation, 
        ResponseInterface} from '../infrastructures/Interfaces'

import { AuthInterface } from '../infrastructures/interface/Auth.interface'


export interface ServiceParameter {
    req: any,
    resp: any,
    data: any
}

export interface ServiceConstructorInterface {
    logger      : LoggerInterface
    eventLog    : EventLogger
    translator  : Translation
    config      : any
    auth        : AuthInterface
}

export default class Service {
    protected logger: LoggerInterface
    protected eventLog: EventLogger
    protected config: any
    protected e: Translation
    protected auth: AuthInterface

    constructor(protected parameters: ServiceConstructorInterface) {
        this.logger     = parameters.logger
        this.eventLog   = parameters.eventLog
        this.e          = parameters.translator
        this.config     = parameters.config
        this.auth       = parameters.auth
    }

    protected response(code: string, data: any, msg: any): ResponseInterface {
        return {
            code: code,
            data: data,
            msg: msg
        }
    }

}