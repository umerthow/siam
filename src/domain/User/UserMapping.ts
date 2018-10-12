import Mapping from '../Mapping'
import { ValidationResponseInterface, MappingConstructor } from '../../infrastructures/Interfaces'
import UserEntity from './UserEntity';



interface ResponseScope {
    id: number | string
    first_name: string
    last_name: string
    email: string
    phone: string
    role: any
    last_login: string | number
    created_at: string | number
    updated_at: string | number
    deleted_at: string | number
    status: number
}


export default class UserMapping extends Mapping {
    
    constructor(protected parameters: MappingConstructor) {
        super(parameters)
    }

    public build(data: any) : UserEntity {
        let firstName = this.validator.escape(data.first_name)
        firstName = this.validator.trim(firstName)

        let lastName = this.validator.escape(data.last_name.toString())
        lastName = this.validator.trim(lastName)
        
        const item = {
            id: null,
            first_name: firstName,
            last_name: lastName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            salt: data.salt,
            last_login: data.last_login,
            role_id: data.role_id,
            created_at: data.created_at,
            updated_at: data.updated_at,
            deleted_at: null
        }

        item.last_login = !data.last_login ? Date.now() : item.last_login
        item.created_at = !data.created_at ? Date.now() : item.created_at
        item.updated_at = !data.updated_at ? Date.now() : item.updated_at
        item.deleted_at = !data.deleted_at ? null : item.deleted_at

        if (data && data.id) {
            item.id = this.validator.toInt(data.id.toString())
        }

        const user = new UserEntity(item)
        if (data.role) {
            const role = {
                id: data.role.id,
                name: data.role.label,
                perms: data.role.perms
            }
            user.role = role
        }

        return user
    }


    public validate(data: any): ValidationResponseInterface  {
        let err = false
        let fields = ['first_name', 'last_name', 'email', 'password']
        
        fields.forEach( key => {
            if (!data[key]) {
                err = true
            }
        })

        if (err) {
            let errMsg = 'user.validation.required_error'
            return this.e.translate(errMsg, 'All fields is required')
        }

        if (!this.validator.isEmail(data.email)) {
            let errMsg = 'user.validation.email_not_valid'
            return this.e.translate(errMsg, 'Email is not valid')
        }
        return this.e.translate('', '')
    }

    public clean(data: string) {
        return this.validator.escape(data)
    }


    public toObj(user: UserEntity) {
        const item = {
            id: user.id,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone: user.phone,
            password: user.password,
            salt: user.salt,
            last_login: user.lastLogin,
            role_id: user.role.id,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            deleted_at: user.deletedAt
        }
        return item
    }


    public scopeResponse(user: UserEntity): ResponseScope {
        const item = {
            id: user.id,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone: user.phone,
            last_login: user.lastLogin,
            role: {
                id: user.role.id,
                name: user.role.name
            },
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            deleted_at: user.deletedAt,
            status: 1
        }

        return item
    }

}