// Engine Infrastructure 
// 
// Agust 31th, 2018
// Verri Andriawan <verri[at]tiduronline.com>

import { Server } from './Interfaces'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import http from 'http'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'

import Auth from './Auth'

export default class Engine implements Server {
    private app: express.Express;
    
    public constructor(
            private config: any,
            private routers: Array<express.Router>,
            private auth: Auth,
            private publicPath: string,
            private templatePath: string,
            
            private version?: string,
            private routerApi?: string,
            private port?: number,
            private assetUrl?: string,
            private viewEngine?: string,
            
        ) {

        this.version      = version
        this.routerApi    = routerApi || '/api/v1'
        this.port         = port || 8000
        this.assetUrl     = assetUrl
        this.templatePath = templatePath || ''
        this.viewEngine   = viewEngine || 'ejs'
        this.publicPath   = publicPath

        this.routers    = routers
        this.auth       = auth
        this.config     = config

        this.app = express()
        this.init()
    }

    // Initializing Engine
    private init() {
        this.app.set('views', this.templatePath)
        this.app.set('view engine', this.viewEngine)
        
        
        this.app.use(helmet())
        this.app.use(cookieParser())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use('/', express.static(this.publicPath))
        this.app.disable('x-powered-by')
        
        // Log Config
        fs.existsSync(this.config.logPath) || fs.mkdirSync(this.config.logPath)
        const streamLogFile = fs.createWriteStream(path.join(this.config.logPath, 'node.log'), {flags: 'a'})
        this.app.use(morgan('combined', {stream: streamLogFile}))

        this.auth
        this.app.set('trust proxy', 1)
        this.app.use(this.auth.sessionMiddleware(this.config))


        // Routers Loader
        for(let key in this.routers) {
            if(this.routers[key]) {
                if(key ===  "default") {
                    this.app.use("", this.routers[key])
                } else {
                    this.app.use(`${this.routerApi}/${key}`, this.routers[key])    
                }
            }
        }
    }

    /**
     * Run Engine
     */
    public run(): void {
        this.app.set('port', this.port)
        
        const server = http.createServer(this.app)
        const info = {
            ver         : this.version || '',
            port        : this.port || 8000,
            routerApi   : this.routerApi || '',
            templatePath: this.templatePath || '',
            assertUrl   : this.assetUrl || '',
            publicPath : this.publicPath
        }   
        info
        server.listen(this.port, () => {
            console.log("Server running on port " + this.port)
            // console.log(info);
        })
    }    
}
