import { Translation, ReturnMessage } from './Interfaces'
import fs from 'fs'

export default class Translator implements Translation {
    private locale : string = 'en'
    protected dictionary : any
    private filePath: string
    

    constructor(rootPath: string, private logger: any) {
        this.filePath = `${rootPath}/locales/${this.locale}.json`
        this.logger = logger
        this.initDictionary()
    }

    public initLanguage(locale: string) {
        this.locale = locale || 'en'
        this.initDictionary()
    }

    public initDictionary() {
        if(fs.existsSync(this.filePath)) {
            try {            
                const dictFile = fs.readFileSync(this.filePath)
                this.dictionary = JSON.parse(dictFile.toString())
            } catch(e) {
                this.logger(e)
            }
        } else {
            this.logger('file', this.filePath)
        }
    }

    /**
     * Helper for Translation
     * 
     * @param code : Code identity for message
     * @param msg : Default Message if code identity is not present
     */
    public translate(code: string, msg: string, params?: any) : ReturnMessage  {
        try {
            msg = this.parsingCode(code) || msg
            msg = this.replaceMsg(msg, params)
        } catch(err) {
            this.logger(err)
        }
        
        return { msgCode: code, msg: msg }
    }

    /**
     * Then job is to parsing info message code
     * 
     * @param code 
     */
    public parsingCode(code: string) : string {
        let codes = code.split('.')
        
        if(codes.length > 0) {
            let data : any = this.dictionary[codes[0]]

            let i = 1 
            while (i < codes.length) {
                if(data) {
                    data = data[codes[i]]
                }
                i++
            }
            return data
        }

        return ''
    } 


    /**
     * The job is for replace parameter message tag
     * 
     * @param msg 
     * @param params 
     */
    public replaceMsg(msg : string, params?: object | any) : string {
        if(params) {
            for(let key in params) {
                msg = msg.replace(`{${key}}`, params[key])
            }
        }
        return msg
    }
}