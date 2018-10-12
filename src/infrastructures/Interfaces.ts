import { Request, Response } from 'express'

export interface Database {
    fetch(id: string | number): any
    fetchOne(params: Object): any
    fetchAll(params: any): any
    save(object: any): any
    update(object: any): any
    delete(id: string | number): any 
}

export interface Server {
    run(): void
}


export interface ServiceParameter {
    req: Request,
    resp: Response,
    data: any
}

export interface PermProviderInterface {
    getByPath(controller: string, action: string): Promise<any>
}

export interface ServiceConstructorInterface {
    logger      : LoggerInterface
    eventLog    : EventLogger
    translator  : Translation
    config      : any
}


export interface Auth {
    authenticate(username: string, password: string): any
    setCookie(resp: Response, token: Array<string>, config: any): void
    setSession(resp: Response, data: any): any
    delSession(req: Request, resp: Response): Boolean
    sessionMiddleware(options: any): any
    generateToken(payload: any, config: any): Array<string>
    validateToken(token: string, secret: string) : any
    tokenParser(cookies: any): object
    payloadExtractor(token:string, signature:string): any
    checkPrivileges(token: string, controller: string, action:string): Promise<Boolean>
}

export interface AuthProviderInterface {
    getByUsername(username: string): any
}

export interface EventLogger {
    logInfo(msg: string) : void 
    middlewareLog(params: any): void
}


export interface Translation {
    initLanguage(locale: string) : any
    initDictionary() : any
    translate(code: string, msg: string, params?: any) : any
}

export interface ReturnMessage {
    msgCode: string
    msg: string
}

export interface ValidationResponseInterface {
    error: Boolean
    msgCode: string
    msg: string
}

export interface ResponseInterface {
    code: string
    data: any
    msg: any
}

export interface DBResponseInterface {
    error: Boolean,
    data: any,
    msg: any
}

export interface Validator {
    escape(item: string): any
    toInt(item: string): any
    isInt(item: string): any
    trim(item: string): any
    isEmail(item: string): any
    isHexadecimal(item: string): any
}

export interface LoggerInterface {
    info(msg: string): void
    error(msg: any): void
}

export interface MailerInterface {
    send(params: any): void
}

export interface UseCaseContructor{
    database    : Database
    logger      : LoggerInterface
    eventLog    : EventLogger
    translator  : Translation
    validator   : Validator
    config      : any
}

export interface MappingConstructor {
    logger      : LoggerInterface
    translator  : Translation
    validator   : Validator
    config      : any
}

