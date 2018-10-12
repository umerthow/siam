// SIAM Project
// September 22th, 2018
//
// Verri Andriawan <verri [at] tiduronlne.com>

import { Response, Request, Router } from 'express'
import { Auth } from '../infrastructures/Interfaces'
import RoleServiceInterface from '../infrastructures/interface/role.service.interface'
import MainClass from './Controller'

export default class Controller extends MainClass {
    private router: Router

    constructor(protected auth: Auth,
        protected service: RoleServiceInterface,
        protected config: any,
        protected plugins: any) {
            super(auth, config, plugins)
            this.router = this.initRouter()
        this.router = Router()
        this.auth
    }

    public init(): Router {
        this.router.get('/', (req: Request, resp: Response) => {
            resp.json({code: '200', data: 'ok'})
        })
        .get('/add', (req: Request, resp: Response) => {
            resp.json({code: '200', data: 'ok'})
        })

        this.roleListAPI()
        this.roleUpdateAPI()
        this.roleDetailAPI()
        this.roleDeleteAPI()
        this.saveRoleAPI()
        this.releasePermAPI()
        this.addPermAPI()
        return this.router
    }


    /**
     * Role List EndPoint
     */
    public roleListAPI(): Router {
        this.router.get('/list', async (req: Request, resp: Response) => {
            let page = req.query.page
            let sort = req.query.sort
            let column = req.query.col

            let result: any = await this.service.fetchAll({page, sort, column})
            resp.json(result)
        })
        return this.router
    }


    /**
     * Detail Role Endpoint
     */
    public roleDetailAPI(): Router {
        this.router.get('/detail/:id', async (req: Request, resp: Response) => {
            const data = req.params
            let result = await this.service.fetchBy({id: parseInt(data.id), req})
            resp.json(result)
        })
        return this.router
    }


    /**
     * Update Role Endpoint
     */
    public roleUpdateAPI(): Router {
        this.router.post('/update/:id', async (req: Request, resp: Response) => {
            let result = await this.service.update(req.params.id, req)
            resp.json(result)
        })
        return this.router
    }


    /**
     * Delete Role Endpoint
     * 
     * [TODO] Audit log delete role
     */
    public roleDeleteAPI(): Router {
        this.router.post('/delete', async (req: Request, resp: Response) => {
            let result = await this.service.delete(req)

            let user: any = this.auth.payloadExtractor(req.headers.authorization!, req.cookies.sig)
            this.eventLog.logInfo(`user ${user.id} : Delete a Role`)
            resp.json(result)
        })

        return this.router
    }


    /**
     * Add new Role Endpoint
     */
    public saveRoleAPI(): Router {
        this.router.post('/save', async (req: Request, resp: Response) => {
            const data = req.body

            let result: any = await this.service.save({req, resp, data})
            if (result.code !== "200") {
                return resp.json(result)
            }

            let user: any = this.auth.payloadExtractor(req.headers.authorization!, req.cookies.sig)
            this.eventLog.logInfo(`user ${user.id} : Create new Role ${data.label}`)

            return resp.json(result)
        })
        return this.router
    }

    /**
     * Remove Permission from a Role
     */
    public releasePermAPI(): Router {
        this.router.post('/release_perm', async (req: Request, resp: Response) => {
            const data = req.body
            
            let result = await this.service.setPermission({req, resp, data}, 'release')
            let user: any = this.auth.payloadExtractor(req.headers.authorization!, req.cookies.sig)
            this.eventLog.logInfo(`user ${user.id} : Remove permission from role`)

            return resp.json(result)
        })
        return this.router
    }


    /**
     * Add new Permission
     */
    public addPermAPI(): Router {
        this.router.post('/set_permission', async (req: Request, resp: Response) => {
            const data = req.body
            
            let result = await this.service.setPermission({req, resp, data}, 'add')
            let user: any = this.auth.payloadExtractor(req.headers.authorization!, req.cookies.sig)
            this.eventLog.logInfo(`user ${user.id} : Add permission from role`)

            return resp.json(result)
        })
        return this.router
    }
}

