import Mapping from '../Mapping'
import { ValidationResponseInterface, MappingConstructor } from '../../infrastructures/Interfaces'
import PermEntity from './PermEntity'

export default class PermMapping  extends Mapping {
    constructor(protected parameters: MappingConstructor)    {
        super(parameters)
    }

    /**
     * Convert Unsafe Object to PermEntity
     * 
     * @param data 
     */
    public build(data: any, scope?: string) : PermEntity {
        const item = {
            id          : data.id,
            controller  : data.controller,
            action      : data.action,
            perm        : parseInt(data.perm),
            createdAt   : data.created_at,
            updatedAt   : data.updated_at
        }

        if(scope === 'new') {
            delete item.id
            item.createdAt = Date.now()
            item.updatedAt = Date.now()
        }

        return new PermEntity(item)
    }



    public toObj(perm: PermEntity): any {
        const item = {
            id          : perm.id,
            controller  : perm.controller,
            action      : perm.action,
            perm        : `0x${perm.perm.toString(16)}`,
            created_at   : perm.createdAt,
            updated_at   : perm.updatedAt
        }

        return item
    }


    public validation(): ValidationResponseInterface {
        return {} as ValidationResponseInterface
    }
}