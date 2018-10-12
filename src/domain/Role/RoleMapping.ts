import Mapping from '../Mapping'
import { ValidationResponseInterface, MappingConstructor, ReturnMessage } from '../../infrastructures/Interfaces'
import RoleEntity from "./RoleEntity";

export default class RoleMapping extends Mapping {
    
    constructor(protected parameters: MappingConstructor) {
        super(parameters)
    }

    /**
     * Convert plain Object to Entity Format
     * 
     * @param data 
     * @param scope 
     */
    public build(data: Object | any, scope?: string) : RoleEntity {
        let item: any = {}

        if(data.id !== undefined && data['id'] === undefined) {
             item = {
                id          : parseInt(data.get('id')),
                label       : data.get('label'),
                description : data.get('description'),
                status      : data.get('status'),
                perms       : data.get('perms') || 0x00,
                created_at  : data.get('created_at'),
                updated_at  : data.get('created_at')
            }
        } else {
            item = {
                id          : parseInt(data.id),
                label       : data.label,
                description : data.description,
                status      : data.status,
                perms       : data.perms || 0x00,
                created_at  : data.created_at,
                updated_at  : data.created_at
            }
        }

        if( scope === 'new' ) {
            item.created_at = Date.now()
            item.updated_at = Date.now()
        }

        const role = new RoleEntity(item)

        return role
    }


    /**
     * Convert Entity Format to Plain Object
     *
     * @param role 
     */
    public toObj(role: RoleEntity) {
        const item = {
            id: role.id,
            label: role.label,
            description: role.description,
            perms: `0x${role.perms.toString(16)}`,
            created_at: role.createdAt,
            updated_at: role.updatedAt
        }
        return item
    }


    /**
     * Validation Role
     * 
     * @param data 
     * @param scope? : For conditional validation. currently availabel options are `new` and `edit`
     */
    public validate(data: any, scope?: string): ValidationResponseInterface  {
        let err = false
        let msg: any

        // 1: active
        // 2: inactive / disabled
        let statuses = [1, 2]

        if(scope === 'new' || scope === 'edit') {
            let fields = ['label', 'perms']
            fields.forEach( key => {
                if (!data[key]) {
                    err = true
                }
            })
        }

        if (err) {
            msg =  this.e.translate('role.validation.required_error', 'All fields is required')
            return this.validationMsg(msg)
        }
        
        if (data.perms.substring(0,2) === "0x") {
            data.perms = data.perms.substring(2)
        }

        if (data.perms && this.validator.isHexadecimal(data.perms)) {
            data.perms = parseInt(data.perms, 16)
        }

        if (data.perms > 0xFFFFFFFFFFFFF) {
            msg = this.e.translate("role.validation.perm_byte_too_long", "Perms is too long")
            return this.validationMsg(msg)
        }

        if (data.perms && !this.validator.isInt(data.perms.toString())) {
            msg = this.e.translate("role.validation.perm_type_not_valid", "Perms must be coba")
            return this.validationMsg(msg)
        }
        
        if (data.status && statuses.indexOf(data.status) !== -1) {
            msg = this.e.translate("role.validation.status_type_not_valid", "Status must be integer")
            return this.validationMsg(msg)
        }

        return this.validationMsg({} as ReturnMessage, false)
    }
}