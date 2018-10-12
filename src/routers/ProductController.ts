// SIAM Project
// September 2th, 2018
//
// Verri Andriawan <verri [at] tiduronlne.com>

import { Response, Request, Router } from 'express'
import { Auth, EventLogger } from '../infrastructures/Interfaces'
import MainClass from './Controller'

class Controller extends MainClass {
    private router: Router

    constructor(protected auth: Auth, protected actionLog: EventLogger, protected config: any) {
        super(auth, actionLog, config)
        this.router = Router()
    }

    public init() : Router {
        this.auth
        this.router.get('/', (req: Request, resp: Response) => {
                        resp.json({code: '200', data: 'ok'})
                    })
                    .get('/add', (req: Request, resp: Response) => {
                        resp.json({code: '200', data: 'ok'})
                    })
        return this.router
    }
}

export default Controller