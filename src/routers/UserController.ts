// SIAM Project
// September 2th, 2018
//
// Verri Andriawan <verri [at] tiduronlne.com>

import { Response, Request, Router } from 'express'
import { Auth } from '../infrastructures/Interfaces'
import { UserServiceInterface } from '../services/UserService'
import MainController from './Controller'





class Controller extends MainController {
    private router: Router
    
    constructor(protected auth: Auth, 
        protected service: UserServiceInterface,
        protected config: any,
        protected plugins: any) {
            super(auth, config, plugins)
            this.router = this.initRouter()
    }


    // Initializing Controller 
    public init() : Router {
        this.router.get('/', (req: Request, resp: Response) => {
                        resp.json({code: '200', data: null, msg: null})
                    })
                    .get('/refreshToken', (req: Request, resp: Response) => {
                        let token = `${req.cookies.token}.${req.cookies.sig}`
                        const data = this.auth.validateToken(token, this.config.secret)
                        
                        if(data.err && data.err.name === "TokenExpiredError") {
                            delete data.payload.exp
                            const newToken = this.auth.generateToken(data.payload, this.config)
                            this.auth.setCookie(resp, newToken, this.config)

                            return resp.json({ "msg": "Token refreshed"})
                        }
                        return resp.json({status: "ok"})
                    })
                    .get('/add', (req: Request, resp: Response) => {
                        resp.json({code: '200', data: null, msg: null})
                    })
                    .get('/edit/:id', (req: Request, resp: Response) => {
                        resp.json({code: '200', data: null, msg: null})
                    })

        this.userAddAPI()
        this.userListAPI()
        this.userDetailAPI()
        this.userDeleteAPI()
        this.userUpdateAPI()
        return this.router
    }




    /**
     * User List Endpoint
     */    
    public userListAPI(): Router {
        this.router.get('/list', async (req: Request, resp: Response) => {
            let page = req.query.page
            let sort = req.query.sort
            let sortColumn = req.query.sort_col

            let result: any = await this.service.fetchAll({page, sort, sortColumn})
            resp.json(result)
        })
        return this.router
    }
    

    /**
     * User Add Endpoint
     */
    public userAddAPI(): Router {
        this.router.post('/save', async (req: Request, resp: Response) => {
            const data = req.body

            let result: any = await this.service.register({req, resp, data})
            if (result.code !== "200") {
                return resp.json(result)
            }

            let user: any = this.auth.tokenParser(req.cookies)
            user = user || { email: 'dummmy@email.email' }

            this.eventLog.logInfo(`user ${user.email} : Create new User with email`)
            return resp.json(result)
        })
        return this.router
    }

    /**
     * Detail User Endpoint
     * 
     */
    public userDetailAPI(): Router {
        this.router.get('/detail/:id', async (req: Request, resp: Response) => {
            const data = req.params
            let result: any = await this.service.fetchBy({id: parseInt(data.id)})
            resp.json(result)
        })
        return this.router
    }


    /**
     * Delete User Endpoint
     */
    public userDeleteAPI(): Router {
        this.router.post('/delete', async (req: Request, resp: Response ) => {
            const data  = req.body
            const id    = parseInt(data.id)
            let result = await this.service.delete(id)
        
            resp.json(result)
        })
        return this.router
    }


     /**
     * Update User Endpoint
     */
    public userUpdateAPI(): Router {
        this.router.post('/update/:id', async (req: Request, resp: Response) => {
            let result = await this.service.update(req.params.id, req)
            resp.json(result)
        })
        return this.router

        
    }

}

export default Controller
