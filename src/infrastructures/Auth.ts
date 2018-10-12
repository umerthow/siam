// SIAM Project
// Aug 31th, 2018
//
// Verri Andriawan <verri [at] tiduronlne.com>

import { AuthProviderInterface, LoggerInterface } from './Interfaces'
import { Encryption } from './Encryptor' 
import { Request, Response } from 'express'
import JWT from 'jsonwebtoken'

import Perm from '../models/Perm.model'

export default class Auth {

    constructor(
            private authProvider: AuthProviderInterface, 
            private encryption: Encryption, 
            private config: any,
            private logger: LoggerInterface,
            private permProvider?: any
        ){
        
            this.authProvider = authProvider
            this.config = config
            this.encryption = encryption
    }

    setProvider(authProvider: AuthProviderInterface) {
        this.authProvider = authProvider
    }

    /**
     * Middleware Session Checker
     *
     * @param options Config
     */
    public sessionMiddleware(options: any): any {
        const self = this
        return function(req: Request, resp: Response, next: any): any {
            
            const route         = req.originalUrl.replace('//', '/').split('/')
            const successUrl    = options.endpoints.successUrl
            const failedUrl     = options.endpoints.failedUrl
            const publicRouters = options.publicRouters
            
            if (route.length === 0 ) return resp.status(404)

            // Check if accessed router is API endpoint?
            // ----------------------------------------------
            if (route[1] === 'api') {
                let token: any = req.headers.authorization
                if(!token) {
                    console.log('Token not found')
                    return resp.json({code: 403, msg: 'Unauthorized to access'})
                }
                token = token.replace('Bearer ', '')
                
                const payload = token
                const signature = req.cookies.sig

                const controller = route[3]
                let action: any = route[4] ? route[4].split('?') : ['list']
                action = action[0]


                // [TODO] optimize index action
                let actionList: any = {
                    list: 'index',
                    update: 'edit',
                    save: 'add',
                    set_permission: 'detail'
                }

                action = actionList[action] ? actionList[action] : action

                Perm.findOne({where: {
                    controller: controller,
                    action: action
                }}).then((result: any) => {
                    
                    let currentUser = self.tokenParser({sig: signature, token: payload})
                    
                    if(!currentUser) {
                        self.logger.info('current User Null')
                        return resp.json({code: 403, msg: 'Unauthorized to access'})
                    }   

                    if (result) {
                        if (result.perm & currentUser.permission) {
                            let validationToken: any = self.validateToken(`${token}.${signature}`, options.secret)
                        
                            if (validationToken.err && validationToken.err.name === 'TokenExpiredError') {
                                return resp.json({code: 401, msg: "Token Expired"})
                            } else if(validationToken.err && !validationToken.name) {
                                self.logger.info('Error in jwt token')
                                return resp.json({code: 403, msg: 'Unauthorized to access'})
                            }
                            return next()
                        } else {
                            // self.logger.error(`Not enough level to access, Current Perm: 0x${currentUser.permission.toString(16)}, Router Perm: 0x${result.perm.toString(16)}`)
                            return resp.json({code: 403, msg: 'Unauthorized to access'})
                        }
                    } else {
                        self.logger.error(`Controller: ${controller} | Action: ${action} not in Permission table in db`)
                        return resp.json({code: 403, msg: 'Unauthorized to access'})
                    }
                })
            


            // If not API endpoint to be accessed
            } else {
                
                if (publicRouters.indexOf(route[1]) > -1) {
                    if (req.cookies && req.cookies.sig && req.cookies.token) {
                        return resp.redirect(successUrl)
                    }
                    return next()
                } else {
                    if (!req.cookies || !req.cookies.sig || !req.cookies.token) {
                        return resp.redirect(failedUrl)
                    } else {
                        Perm.findOne({where: {
                            controller: route[1],
                            action: route[2]
                        }}).then((result: any) => {
                            let currentUser = self.tokenParser(req.cookies)
                            if(!result) {
                                return next()
                            }
                            
                            if(!currentUser) {
                                return resp.redirect(failedUrl)
                            } else {
                                return next()
                            }

                        })
                    }
                }
            }
        }
    }


    /**
     * Session Setter
     *
     * @param req
     * @param data
     */
    public setSession(resp: Response, data: any) {
        if (resp.cookie) {
            let param = {
                id: data.id,
                username: data.email,
                permission: data.perms
            }
            let token = this.generateToken(param, this.config)
            this.setCookie(resp, token, this.config)
        }
    }


    /**
     * Set Cookie as Token
     *
     * @param resp
     * @param token
     * @param config
     */
    public setCookie(resp: Response, token: Array<string>, config: any) {
        let expires = Date.now()
            expires += config.cookieLive
        resp.cookie('sig',   token[2], {httpOnly: true, expires: new Date(expires) })
        resp.cookie('token', token[1], {expires: new Date(expires) })
    }


    /**
     * Delete session
     *
     * @param req
     */
    public delSession(req: Request, resp: Response): Boolean {
        resp.clearCookie('token')
        resp.clearCookie('sig')
        return true
    }


    /**
     * Authentication method
     *
     * @param username
     * @param password
     */
    public async authenticate(username: string, password: string): Promise<Object> {
        if (username && password) {
            let user = await this.authProvider.getByUsername(username)
            let valid = await this.encryption.compare(password, user.password)
            if (valid) {
                return user
            }
        }
        return false
    }


    /**
     * Token Validation
     *
     * @param payload
     * @param done Callback Function
     */
    public validateToken(token: string, secret: string): any {
        const tokenHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        token = `${tokenHeader}.${token}`

        let result: any
        try {
            JWT.verify(token, secret, (err: any, decoded: any) => {
                let payload = JWT.decode(token)
                result = {err, payload}
            })
            return result
        } catch(e) {
            console.log(`Token is invalid : \n token: ${token}`)
            return result = {err: true}
        }
        
    }



    /**
     * Token Generator by JWT
     *
     * @param payload
     * @param config
     */
    public generateToken(payload: any, config: any): Array<string>  {
        let iat = Math.floor(Date.now() / 1000)
        let exp = iat + (60 * 30) // 30 minutes to expired?
        payload.iat = iat

        const secret    = config.secret || 'eyJhbGciOiJIUztiduronlineI1NiIsInR5secretcCI6IkpnumberXVCJ9'
        const options   = config.jwtOpt || { expiresIn: exp }

        let token: string = JWT.sign(payload, secret, options)
        return token.split('.')
    }


    /**
     * Token Parser
     * @param cookies 
     */
    public tokenParser(cookies: any): any {
        let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${cookies.token}.${cookies.sig}`
        try {
            return JWT.decode(token)
        } catch(e) {
            return null
        }
    }


    /**
     * Payload Extractor
     * @param token Authorization token
     */
    public payloadExtractor(token: string, signature: string) {
        token = token.replace('Bearer ', '')
        const payload = token
        return this.tokenParser({sig: signature, token: payload})
    }



    /**
     * Privileges Validation
     * 
     * @param cookies : Cookies from reqeust  
     * @param controller : Requested controller
     * @param action : Requested Action
     */
    public async checkPrivileges(cookies: any, controller: string, action: string): Promise<Boolean> {
        let user = this.tokenParser(cookies)
        if(this.permProvider) {
            let result = await this.permProvider.fetchBy({controller, action})
            if(result.error) return false
            
            let priv = result.data
            priv.perm = parseInt(priv.perm, 16)
            user.permission = parseInt(user.permission, 16)
            return (user.permission & priv.perm) > 0
        }
        return false        
    }

    
}
