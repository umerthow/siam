// SIAM Project
// Aug 31th, 2018
//
// Verri Andriawan <verri [at] tiduronlne.com>


import path from 'path'
import validator from 'validator'

import Engine from './infrastructures/Engine'
import Auth from './infrastructures/Auth'
import ActionLogger from './infrastructures/ActionLogger'
import Translator from './infrastructures/Translator'
import Database from './infrastructures/MySQL'

import DefaultController from './routers/DefaultController'
import RoleController from './routers/RoleController'
import PermController from './routers/PermController'
import ProductController from './routers/ProductController'
import UserController from './routers/UserController'
import DepartementController from './routers/DepartementController'
import JobController from './routers/JobController'




import User from './models/User.model'
import Role from './models/Role.model'
import Permission from './models/Perm.model'
import ResetPassword from './models/ResetPassword.model'

import { UserUseCase } from './domain/User/UserUseCase'
import { ResetUseCase } from './domain/ResetPassword/ResetUseCase'
import { UserService } from './services/UserService'
import { Encryptor } from './infrastructures/Encryptor'
import { UseCaseContructor } from './infrastructures/Interfaces'
import { Logger } from './infrastructures/Logger'
import { Mailer } from './infrastructures/Mailer'
import RoleService from './services/RoleService'
import { RoleUseCase } from './domain/Role/RoleUseCase'
import PermUseCase from './domain/Permission/PermUseCase'
import PermService from './services/PermService'

const config = require(path.join(process.cwd(), 'config'))

const logger  = new Logger()

const db            = new Database(null, config)
const actionLog     = new ActionLogger(db)
const translator    = new Translator(__dirname, logger)
const encryptor     = new Encryptor()
const mailer        = new Mailer(config.mailer)

const useCaseParam: UseCaseContructor = {
    database    : {} as Database,
    logger      : logger,
    eventLog    : actionLog,
    translator  : translator,
    validator   : validator,
    config      : config
}

let userParams = Object.assign({}, useCaseParam)
userParams.database = new Database(User, config)
const userProvider = new UserUseCase(userParams, encryptor)

let resetParams = Object.assign({}, useCaseParam)
resetParams.database = new Database(ResetPassword, config)
const resetProvider = new ResetUseCase(resetParams)

let roleParams = Object.assign({}, useCaseParam)
roleParams.database = new Database(Role, config)
const roleProvider = new RoleUseCase(roleParams)

let permsParams = Object.assign({}, useCaseParam)
permsParams.database = new Database(Permission, config)
const permProvider = new PermUseCase(permsParams)


const auth = new Auth(userProvider, encryptor, config, logger)
const SVCParams = {
    logger      : logger,
    eventLog    : actionLog,
    translator  : translator,
    config      : config,
    auth        : auth
}
const userSvc = new UserService(auth, userProvider, resetProvider, mailer, SVCParams)
const roleSvc = new RoleService(roleProvider, userProvider, permProvider, SVCParams)
const permSvc = new PermService(permProvider, SVCParams)

const DefaultRouter = new DefaultController(auth, userSvc, config, {translator, eventLog: actionLog})
const UserRouter    = new UserController(auth, userSvc, config, {translator, eventLog: actionLog})
const ProductRouter = new ProductController(auth, actionLog, config)
const RoleRouter    = new RoleController(auth, roleSvc, config, {translator, eventLog: actionLog})
const PermRouter    = new PermController(auth, permSvc, config, {translator, eventLog: actionLog})
const DeptRouter    = new DepartementController({} as Auth)
const JobRouter     = new JobController({} as Auth)

const opts = config
opts.controllers = {
    default     : DefaultRouter.init(),
    users       : UserRouter.init(),
    products    : ProductRouter.init(),
    roles       : RoleRouter.init(),
    perms       : PermRouter.init(),
    departements: DeptRouter.init(),
    jobs        : JobRouter.init()   
}

opts.auth = auth
const Express = new Engine( opts,
                            opts.controllers,
                            auth,
                            opts.publicPath,
                            opts.templatePath )

Express.run()
