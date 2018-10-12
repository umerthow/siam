export default class PermEntity {
    private data: any

    constructor(data: Object) {
        this.data = data
    }

    get id() { return this.data.id }
    get controller() { return this.data.controller }
    get action() { return this.data.action }
    
    get perm() { return this.data.perm }
    set perm(value: number) {
        value = value || 0xFF
        this.data.perm = value
    }
    
    get createdAt() { return this.data.createdAt }
    get updatedAt() { return this.data.updatedAt }
    set updatedAt(value) {
        value = value || 0
        this.data.updatedAt = value
    }
}