// SIAM Project
// September 2th, 2018
//
// Verri Andriawan <verri [at] tiduronlne.com>

import { Response, Request, Router } from 'express'
import { Auth } from '../infrastructures/Interfaces'

class Controller {
    private router: Router

    constructor(private auth: Auth) {
        this.auth = auth
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