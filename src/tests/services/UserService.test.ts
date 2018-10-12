// import { assert } from 'chai'


import { UserService, UserServiceInterface } from '../../services/UserService'
import { MailerInterface, LoggerInterface, EventLogger, Translation } from '../../infrastructures/Interfaces'
import { AuthInterface } from '../../infrastructures/interface/Auth.interface'
import { UserUseCaseInterface } from '../../domain/user/UserUsecase'
// import {Response, Request} from 'express'


describe("User Service", () => {
    let userSVC: UserServiceInterface
    let auth = {} as AuthInterface
    let userProv = {} as UserUseCaseInterface
    let mailer = {} as MailerInterface
    let logger = {} as LoggerInterface
    let eventlog = {} as EventLogger
    let trans = {} as Translation
    

    beforeEach(() => {
        userSVC = new UserService(auth, userProv, userProv, mailer, {
            logger      : logger, 
            eventLog    : eventlog,
            translator  : trans,
            config      : {},
            auth        : auth
        })
        userSVC
    })

    describe(".register", () => {
        describe("When user is not authenticated", () => {
            it.skip("Validate password and password confirmation")
        })

        describe("When user is authenticated", () => {
            it.skip("No need to validate password and password confirm")
        })

    })
}) 