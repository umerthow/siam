import { Auth, ServiceParameter, ReturnMessage, MailerInterface, ResponseInterface, DBResponseInterface } from '../infrastructures/Interfaces'
import { UseCaseInterface } from '../domain/UseCase'
import { UserUseCaseInterface } from '../domain/User/UserUseCase'
import Service, {ServiceConstructorInterface} from './Service'




export interface UserServiceInterface {
    update(id: any, req: any): Promise<ResponseInterface>
    delete(id: number): any
    fetchAll(params: any): any
    fetchBy(params: any): any
    process(data: ServiceParameter): void
    register(data: ServiceParameter): Promise<ResponseInterface>
    resetPassword(data: ServiceParameter): Promise<ResponseInterface>
    generateNewPassword(data: ServiceParameter): Promise<ResponseInterface>
    compareToken(token: string): Promise<ResponseInterface>
    confirmEmail(token: string): Promise<ResponseInterface>
}

export class UserService extends Service implements UserServiceInterface {
    
    /**
     * Constructor
     *
     * @param auth
     * @param config
     * @param eventLog : this is optional, this just notifier to logger storage
     */
    constructor(
            protected auth: Auth,
            private userProvider: UserUseCaseInterface,
            private userResetProvider: UseCaseInterface,
            private mailer: MailerInterface,
            protected parameters: ServiceConstructorInterface,
        ) {

        super(parameters)
        this.auth = auth
        this.mailer = mailer
        this.userResetProvider = userResetProvider

    }

    /**
     * Delete by ID
     * 
     * @param id 
     */
    public async delete(id: number): Promise<ResponseInterface> {
        let msg = this.e.translate('log.users.success_delete', 'User has been deleted')
        if(id) {
            let result = await this.userProvider.softDelete(id)
            if(result) {
                if(!result.error) return this.response("200", true, msg)
                else this.logger.info(result.msg)
            }
        }
        msg = this.e.translate('log.users.failed_delete', 'Failed to delete user')
        return this.response("403", null, msg)
    }


    /**
     * Update User Data
     * @param params 
     */
    public async update(id: any, req: any): Promise<ResponseInterface> {
        let data = req.body
        let result: DBResponseInterface = {error: true, data: '', msg: ''}
        result.msg = this.e.translate('user.notify.failed_update', 'User failed to update')

        id = id ? parseInt(id) : 0
        data.id = data.id ? parseInt(data.id) : 0
        let msg: string

        if (data.id !== id) {
            msg = this.e.translate('user.notify.failed_update', 'User failed to update')
            this.logger.error(`user id is not equal data.id: ${data.id} query.id: ${id}`)
            return this.response('403', null, msg)
        }

        if(data.id > 0) {
            try {
                result = await this.userProvider.fetchBy({id: data.id})
            } catch (err) {
                this.logger.error(err) 
                msg = this.e.translate('user.error.not_found', 'User doesn\'t exists')
                return this.response('404', null, msg)
            }

            let user = result.data
            if(user && user.id) {
                try {
                    result = await this.userProvider.update(user, data)
                } catch(err) {
                    this.logger.error(err)
                    msg  = this.e.translate('user.notify.failed_update', 'User failed to update')
                    return this.response('403', null, msg)
                }

                if(result && !result.error) {
                    msg = this.e.translate('user.notify.success_update', 'User successfully updated')
                    return this.response('200', true, msg)
                }
             }
        }

        return this.response("403", null, result.msg)
    }


    /**
     * Fetch All Users
     * 
     * @param params 
     */
    public async fetchAll(params: any): Promise<ResponseInterface> {
        let page = params.page 
        let sort = params.sort
        let sortColumn = params.col

        let result = await this.userProvider.fetchAll(page, sort, sortColumn)
        if(result && !result.error) {
            return this.response('200', result.data, '')
        }
        return this.response('401', [], '')
    }

    /**
     * Fetch detail user
     */
    public async fetchBy(params: any): Promise<ResponseInterface> {
        let result = await this.userProvider.getBy({id: params.id})
        if(!result)  {
            let msg = this.e.translate('users.not_found', 'User not found')
            return this.response('404', null, msg)
        } 
        return this.response('200', result.data, '')
    }


    /**
     * Login Process
     *
     * @param params
     */
    public async process(params: ServiceParameter): Promise<object> {
        const body = params.data

        const username: string = body.username
        const password: string = body.password

        let user = await this.auth.authenticate(username, password)
        if (user) {
            let msg = this.e.translate('log.sign_in', `User with id '{id}' just logged in`, {id: user.id})
            
            this.eventLog.logInfo(msg.msg)
            await this.auth.setSession(params.resp, {id: user.id, username: user.email, perms:user.role.perms })

            user.lastLogin = Date.now()
            await this.userProvider.update(user, user)
            return user
        }
        return user
    }


    /**
     * Registration process
     *
     * @param params
     */
    public async register(params: ServiceParameter): Promise<ResponseInterface> {
        const data = params.data
        let payload = this.auth.tokenParser(params.req.cookies)
        
        if(!payload) {
            let msg: ReturnMessage 
            
            if(!data.password) {
                msg = this.e.translate('user.register.password_is_required', 'Password field is required')
                return this.response('403', null, msg)
            } else {
                if (data.password !== data.password_confirm ) {
                    msg = this.e.translate('user.register.password_not_match', 'Password is not match')
                    return this.response('403', null, msg)
                }
            }
        } else {
            data.password = 'generate4321'
        }

        const errResult: ReturnMessage = this.userProvider.validate(data)
        if (errResult.msgCode) {
            return this.response('403', null, errResult)
        }

        const response: DBResponseInterface = await this.userProvider.create<DBResponseInterface>(data)
        if (response.error) {
            this.logger.info(response.msg)
            let msg: ReturnMessage = this.e.translate('user.register.error_validation', 'Failed to register new')
            if (response.msg.email) {
                msg = this.e.translate('user.register.email_used', 'Email has been used')
            } 
            return this.response('403', null, msg)
        }
        let user = await this.userProvider.getByUsername(response.data.email)
        
        delete user.data.password
        delete user.data.salt
        delete user.data.last_login

        let subject = this.e.translate('user.register.subject_welcome_email', 'Registation Confirm')

        this.mailer.send({
            email: user.email,
            subject: subject.msg,
            msg: `Halo ${user.first_name} ${user.last_name},<br><br> Welcome to our project`
        })

        if(!payload) {
            await this.auth.setSession(params.resp, { id: user.id, username: user.email})
        }
        return this.response('200', user, '')
    }

    /**
     * Reset Function 
     * 
     * @param params 
     */
    public async resetPassword(params: ServiceParameter): Promise<ResponseInterface> {
        let username = params.data.username
        let user = await this.userProvider.getByUsername(username)
        if (user) {
            let result: DBResponseInterface = await this.userResetProvider.create<DBResponseInterface>({user_id: user.id})
            
            if(result.error) {
                this.logger.error(result.msg)
                return this.response("500", null, "Internal server error");
            } 
            
            let data = result.data
            let subject = this.e.translate('user.register.subject_reset_email', 'Reset Password')
            
            await this.mailer.send({
                email: user.email,
                subject: subject.msg,
                msg: `Reset Link: <a href="${this.config.resetPassword.endpoint}?token=${data.token}" target="_blank">Reset Password</a>`
            })   
        } 
        let msg = this.e.translate('user.register.reset_password', 'We will sent you a new token if your input email is in our database');
        return this.response('200', null, msg)
    }

    /**
     * Generate New Password
     * 
     * @param params 
     */
    public async generateNewPassword(params: ServiceParameter): Promise<ResponseInterface> {
        const data = params.data
        let msg: ReturnMessage = this.e.translate('user.register.password_not_match', 'Password is not match')
        
        if (data.password !== data.password_confirm ) {
            return this.response('401', null, msg)
        }

        let token = params.req.query.token
        if (!token) {
            msg = this.e.translate('user.password.token_required', 'Token is required')
            return this.response('401', null, msg)
        }
        let result = await this.compareToken(token)
        if (result.code !== "200") {
            return result
        }

        let validToken = result.data
        if (validToken) {
            let user = await this.userProvider.getBy({id: validToken.userId}, 'entity')
            if (user) {
                let salt = user.salt
                user.password = await this.userProvider.generatePassword(data.password, salt)

                let userUpdated = await this.userProvider.update(user, data)
                if (userUpdated) {
                    validToken.confirmedAt = Date.now()
                    await this.userResetProvider.update(user, validToken)

                    let subject = this.e.translate('user.register.subject_reset_email', 'Reset Password')
                    await this.mailer.send({
                        email: user.email,
                        subject: subject.msg,
                        msg: `Your password has been reseted`
                    })   

                    msg = this.e.translate('user.password.password_has_been_reseted', 'Password has been reseted')
                    return this.response('200', null, msg)   
                }
            }
        }
        
        msg = this.e.translate('user.password.failed_to_reset_password', 'Thank you for signed up')
        return this.response('401', null, msg)
        
    }

    /**
     * Compare Token from client
     * 
     * @param token
     */
    public async compareToken(token: string): Promise<ResponseInterface> {
        let validToken = await this.userResetProvider.getBy({token, confirmed_at: null}, 'entity')

        let msg: any = {}
        if (validToken) {
            let expiredAt = new Date(validToken.expiredAt).getTime()
            if (expiredAt > Date.now()) {
                return this.response('200', validToken, "")
            }

            msg = this.e.translate('user.password.token_expired', 'Token has been expired')
            return this.response('401', null, msg)
        }

        msg = this.e.translate('user.password.invalid_token', 'Token is invalid')
        return this.response('200', null, msg)
    }


    public async confirmEmail(token: string): Promise<ResponseInterface> {
        return this.response('200', null, '')
    }

    

}
