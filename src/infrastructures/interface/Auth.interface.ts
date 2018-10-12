export interface AuthInterface {
    authenticate(username: string, password: string): any
    setCookie(resp: any, token: Array<string>, config: any): void
    setSession(resp: any, data: any): any
    delSession(req: any, resp: any): Boolean
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