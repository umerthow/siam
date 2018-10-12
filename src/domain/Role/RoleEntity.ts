
export default class RoleEntity {
    private data: any
    private _perms = 0x00

    constructor(data: any) {
        this.data = data
        this._perms = data.perms ? data.perms : this._perms
    }

    get id() { return this.data.id }
    get label() { return this.data.label }
    get description() { return this.data.description }
    
    get perms() { return this._perms }
    set perms(value: number) {
        this._perms = value || 0x00
    }
    get status() { return this.data.status }

    get createdAt() { return this.data.created_at }
    get updatedAt()  { return this.data.updated_at }
}