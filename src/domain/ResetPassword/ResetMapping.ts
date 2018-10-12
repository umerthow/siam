import Mapping from '../Mapping'
import { ReturnMessage, MappingConstructor } from '../../infrastructures/Interfaces'
import ResetEntity from './ResetEntity';
import moment from 'moment'
import uuid1 from 'uuid/v1'


export default class ResetMapping extends Mapping {
    
    constructor(protected parameters: MappingConstructor) {
        super(parameters)
    }

    public build(data: any) : ResetEntity {
        const item = {
            id: "",
            user_id: data.user_id,
            token: data.token,
            reseted_at: data.reseted_at,
            created_at: data.created_at,
            updated_at: data.updated_at,
            expired_at: data.expired_at,
            confirmed_at: data.confirmed_at
        }

        let epoch = Date.now()
        let expired_at = epoch + (1000 * 60 * 60 * 3);
        
        if (!data.reseted_at) { item.reseted_at = this.__convertDate(epoch); }
        if (!data.created_at) { item.created_at = this.__convertDate(epoch); }
        if (!data.updated_at) { item.updated_at = this.__convertDate(epoch); }
        if (!data.expired_at) { item.expired_at = this.__convertDate(expired_at) }
        if (!data.token)      { item.token = this.__getToken() }

        if (data && data.id) {
            item.id = this.validator.toInt(data.id.toString())
        }

        const reset = new ResetEntity(item)
        return reset
    }


    public validate(data: any): ReturnMessage  {
        return this.e.translate('', '')
    }

    public clean(token: string) {
        return this.validator.escape(token)
    }
    

    public toObj(obj: ResetEntity) {
        const item = {
            id: obj.id,
            user_id: obj.userId,
            token: obj.token,
            reseted_at: obj.resetedAt,
            created_at: obj.createdAt,
            updated_at: obj.updatedAt,
            expired_at: obj.expiredAt,
            confirmed_at: obj.confirmedAt
        }

        if (obj.confirmedAt) { item.confirmed_at = this.__convertDate(<number>obj.confirmedAt) }
        return item
    }


    private __convertDate(time: number): string {
        return moment.utc(time).format()
    }

    private __getToken(): string {
        return uuid1()
    }
    
}