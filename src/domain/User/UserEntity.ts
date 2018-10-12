interface UserInterface {
    id          : number | string
    firstName   : string
    lastName    : string
    email       : string
    phone       : string
    password    : string
    role       : any
    salt?       : string
    lastLogin?  : number | string
    createdAt   : number | string
    updatedAt   : number | string
    deletedAt?  : number | string
}

const GROUP: any = {
    1: 'Administrator',
    2: 'Staff'
}

export default class UserEntity implements UserInterface {
    private _role: any

    constructor(private data: Object | any) {
        this.data = data
        this._role = {
            id: this.data.role_id || 2,
            name: GROUP[this.data.role_id] || GROUP[2],
            perms: 0x00
        }
    }

    get id(): number | string { return this.data.id }
    get firstName(): string { return this.data.first_name }
    get lastName(): string { return this.data.last_name }
    get email(): string { return this.data.email }
    get phone(): string { return this.data.phone }

    get password(): string { return this.data.password }
    set password(value) {
        this.data.password = value || ''
    }

    get salt(): string { return this.data.salt }
    set salt(value) {
        this.data.salt = value || ''
    }

    get lastLogin(): number | string { return this.data.last_login }
    set lastLogin(value) {
        this.data.last_login = value
    }
    
    get role() {
        return this._role
    }
    
    get createdAt(): number | string { return this.data.created_at }
    get updatedAt(): number | string { return this.data.updated_at }
    get deletedAt(): number | string { return this.data.deleted_at }

    set role(value) {
        value = value || {
                            id: this.data.role_id || 2,
                            name: GROUP[this.data.role_id] || GROUP[2]
                        }
        this._role = value
    }
}
