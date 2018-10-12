import  {MappingConstructor, 
         Validator, 
         LoggerInterface,
         ReturnMessage,
         ValidationResponseInterface} from '../infrastructures/Interfaces'

export default class Mapping {
    protected config: any
    protected validator: Validator
    protected logger: LoggerInterface
    protected e: any // shortcut for translation

    constructor(protected parameters: MappingConstructor) {
        this.config     = parameters.config
        this.logger     = parameters.logger
        this.validator  = parameters.validator
        this.e          = parameters.translator
    }

    protected validationMsg(msg: ReturnMessage, error?: Boolean): ValidationResponseInterface {
        error = error !== undefined? error : true

        return {
            error: error,
            msgCode: msg.msgCode,
            msg: msg.msg
        }
    }

}
