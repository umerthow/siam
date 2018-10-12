// SIAM Project
// September 2th, 2018
//
// Verri Andriawan <verri [at] tiduronlne.com>

import { Response, Request, Router} from 'express'
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

    public init() : Router {
        this.router
            .get('/', (req: Request, resp: Response) => {
                resp.redirect('/login')
            })
            .get('/audit', (req: Request, resp: Response) => {
                const data = this.auth.tokenParser(req.cookies)
                resp.render('dashboard', { user: data })
            })
            .get('/reports', (req: Request, resp: Response) => {
                const data = this.auth.tokenParser(req.cookies)
                resp.render('dashboard', { user: data })
            })
                        
        this.authRouter()
        this.dashboardRouter()
        this.registrationRouter()
        this.userRouter()
        this.roleRouter()
        this.privilegeRouter()
        this.categories()
        this.productRouter()
        this.departementRouter()
        this.jobsRouter()

        return this.router
    }


    /**
     * Authentication Router
     */
    public authRouter(): Router {
        this.router.get('/login', (req: Request, resp: Response) => {
            resp.render('login')
        })
        .get('/logout', (req: Request, resp: Response) => {
            console.log('this')
            this.auth.delSession(req, resp)
            resp.redirect('/login')
        })
        .get('/auth', (req: Request, resp: Response) => {
            resp.redirect('/login')
        })
        .post('/auth', async (req: Request, resp: Response) => {
            const data = {
                username: req.body.username,
                password: req.body.password
            }
            let result = await this.service.process({req, resp, data})
            if( result ) {
                return resp.redirect(this.config.endpoints.successUrl)
            }
            let msg = this.e.translate('user.auth.authentication_failed', 'Email or Password is invalid')
            resp.render('login', {type: 'warning', notify: msg})
            
        })
        .get('/auth/new_password', async (req: Request, resp: Response) => {
            const token = req.query.token
            let response: any = {}
            if ( token ) {
                response = await this.service.compareToken(token)
                if (response.data) {
                    return resp.render('new_password', {token})
                }
                return resp.render('login', {type: 'warning', notify: response.msg})
            }

            resp.redirect('/login')
        })
        .post('/auth/new_password', async (req: Request, resp: Response) => {
            const params = {
                req,
                resp,
                data: req.body
            }
            let result = await this.service.generateNewPassword(params)
            if (result.code === "200") {
                return resp.redirect("/login")
            }

            resp.render('new_password', {
                    token: req.query.token, 
                    type: 'warning', 
                    notify: result.msg
                })
        })

        return this.router
    }


    /**
     * Registration Router
     */
    public registrationRouter(): Router {
        this.router.get('/register', (req: Request, resp: Response) => {
            resp.render('register')
        })
        .post('/register', async (req: Request, resp: Response) => {
            const data = req.body
            let result: any = await this.service.register({req, resp, data})

            if (result.code !== "200") {
                return resp.render('register', {type: 'warning', notify: result.msg})
            }

            const params = {
                username: req.body.email,
                password: req.body.password
            } 
            await this.service.process({req, resp, data: params})
            resp.redirect('/login')
        })
        // .get('/register/confirm', async (req: Request, resp: Response) => {
        //     const token = req.query.token
        //     let result = await this.service.confirmEmail(token)
        // }) 
        .get('/forgot', (req: Request, resp: Response) => {
            resp.render('forgot')
        })
        .post('/forgot', async (req: Request, resp: Response) => {
            const data = req.body
            let result: any = await this.service.resetPassword({req, resp, data})
            resp.render("login", {type: 'success', notify: result.msg})
        })


        return this.router
    }

    /**
     * Dashboard Router
     */
    public dashboardRouter(): Router {
        this.router.get('/dashboard', (req: Request, resp: Response) => {
            const data = this.auth.tokenParser(req.cookies)
            resp.render('dashboard', { user: data })
        })
        return this.router 
    }


    /**
     * Users Router
     */
    public userRouter(): Router {
        this.router.get('/users', (req: Request, resp: Response) => {
                    const data = this.auth.tokenParser(req.cookies)
                    resp.render('dashboard', { user: data })
                })

                .get('/users/add', (req: Request, resp: Response) => {
                    const data = this.auth.tokenParser(req.cookies)
                    resp.render('dashboard', { user: data })
                })

                .get('/users/edit/:id', (req: Request, resp: Response) => {
                    const data = this.auth.tokenParser(req.cookies)
                    resp.render('dashboard', { user: data })
                })
        return this.router
    }

    /**
     * Roles Routers
     */    
    public roleRouter(): Router {
        this.router.get('/roles', (req: Request, resp: Response) => {
            const data = this.auth.tokenParser(req.cookies)
            resp.render('dashboard', { user: data })
        })
        return this.router
    }


    /**
     * Privileges Router
     */
    public privilegeRouter(): Router {
        this.router.get('/privileges', (req: Request, resp: Response) => {
            const data = this.auth.tokenParser(req.cookies)
            resp.render('dashboard', { user: data })
        })
       
        return this.router
    }

    /**
     * Categories Router
     */
    public categories(): Router {
        this.router.get('/categories', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })
                    
                    .get('/categories/add', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })
                  
                    .get('/categories/edit/:id', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })

        return this.router
    }

    /**
     * Product Router
     */
    public productRouter(): Router {
        this.router.get('/products', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })
                    .get('/products/add', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies) 
                        resp.render('dashboard', { user: data })
                    })
                   
                    .get('/products/edit/:id', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })

        return this.router
    }
    
    /**
     * Departement Router
     */
    public departementRouter(): Router {
        this.router.get('/departements', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })
                    .get('/departements/add', (req: Request, resp: Response)=> {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data} )
                    })
                    .get('/departements/edit/:id', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })
        return this.router
    }


    /**
     * Jobs Router
     */
    public jobsRouter(): Router {
        this.router.get('/jobs', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })
                    .get('/jobs/add', (req: Request, resp: Response)=> {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data} )
                    })
                    .get('/jobs/edit/:id', (req: Request, resp: Response) => {
                        const data = this.auth.tokenParser(req.cookies)
                        resp.render('dashboard', { user: data })
                    })
        return this.router
    }

}

export default Controller
