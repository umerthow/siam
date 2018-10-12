import { Database, DBResponseInterface } from './Interfaces'
import { Sequelize } from 'sequelize-typescript'


export default class Sqlite implements Database {
    private adapter : any

    constructor(private provider: any, private config: any) {
        this.config     = config
        this.provider   = provider

        this.adapter = new Sequelize({
            url: config.database.dsn,
            modelPaths: config.database.modelPaths
        })

        this.adapter
            .authenticate()
            .then(() => {
                console.log('Database is ready to use')
            })
            .catch((err: any) => {
                console.log('Internal server error: ' + err)
            })
        
        this.config
    }


    protected response(error: Boolean, data: any, msg: any): DBResponseInterface {
        return {
            error: error,
            data: data,
            msg: msg
        }
    }

    public async fetch(key: string | number) : Promise<DBResponseInterface> {
        return this.response(true, null, null)
    }
    
    public async fetchOne(params: any) : Promise<Object> {
        try {
            let result = await this.provider.findOne(params)
            if(!result) {
                return this.response(true, null, '')
            }
            return this.response(false, result, '')
        } catch(err) {
            return this.response(true, null, err)
        }
    }

    public async fetchAll(params: any): Promise<DBResponseInterface> {
        return this.response(true, null, null)
    }

    /**
     * [TODO] Security Concern for every input fields
     * 
     * Save data to DB Storage
     * @param params Form Data
     */
    public async save(params: any): Promise<DBResponseInterface> {
        try {
            await this.provider.create(params)
            return this.response(false, params, [])
        } catch(err) {
            let msgErr: any = {}
            if(err.errors && err.errors.length > 0) {
                err.errors.forEach( (error : any) => {
                    msgErr[error.path] = error.message
                });
            } else {
                msgErr['Internal'] = err
            }
            return this.response(true, null, msgErr)
        }
    }

    /**
     * [TODO] Security Concern for every input fields
     * 
     * Update data to DB Storage
     * @param params 
     */
    public async update(params: any, where?: any): Promise<DBResponseInterface> {
        try {
            let data = await this.provider.findOne({where: {id: params.id}})
            if (!where) { where = {id: data.id} }
            
            if (data) {
                let updated = await this.provider.update(params, { where })
                if (updated) {
                    return this.response(false, updated, null)
                }
            }
            return this.response(true, null, null)
        } catch(err) {
            let msgErr: any = {}
            if(err.errors && err.errors.length > 0) {
                err.errors.forEach( (error : any) => {
                    msgErr[error.path] = error.message
                });
            } else {
                msgErr['Internal'] = err
            }
            return this.response(true, null, msgErr)
        }
    }


    public async delete(): Promise<DBResponseInterface> {
        return this.response(true, null, null)
    }
}
