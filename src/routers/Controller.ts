import { Router } from 'express'
import { Auth, EventLogger, Translation } from '../infrastructures/Interfaces'

class Controller {
    protected eventLog: EventLogger
    protected logger: any
    protected e: Translation

    constructor(protected auth: Auth, protected config: any, protected plugins?: any) {
        this.auth       = auth
        this.plugins    = plugins
        this.config     = config

        this.eventLog   = this.plugins.eventLog
        this.logger     = this.plugins.logger
        
        
        this.e = this.defaultTranslator()
        if (this.plugins) 
            this.e = this.plugins.translator
        
        
    } 
    
    protected defaultTranslator() : Translation {
        return {
            translate: () => {}, 
            initLanguage: () => {}, 
            initDictionary: () => {}
        }
    }

    /**
     * Router Initialize
     */
    protected initRouter() : Router {
        return Router()
    }
}

export default Controller
