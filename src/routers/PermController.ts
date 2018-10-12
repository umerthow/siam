// SIAM Project
// September 22th, 2018
//
// Verri Andriawan <verri [at] tiduronlne.com>

import { Response, Request, Router } from 'express'
import { Auth } from '../infrastructures/Interfaces'
import PermServiceInterface from '../infrastructures/interface/Perm.service.interface'
import MainClass from './Controller'

export default class Controller extends MainClass {
    private router: Router

    constructor(protected auth: Auth,
        protected service: PermServiceInterface,
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

        this.permListAPI()
        return this.router
    }


    /**
     * Role List EndPoint
     */
    public permListAPI(): Router {
        this.router.get('/list', async (req: Request, resp: Response) => {
            let page = req.query.page
            let sort = req.query.sort
            let column = req.query.col

            let result: any = await this.service.fetchAll({page, sort, column})
            resp.json(result)
        })
        return this.router
    }

}

