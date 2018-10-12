export default class PageEntity {
    private data: any
    
    constructor(data: Object) {
        this.data = data
    }

    get id() { return this.data.id }
    get title() { return this.data.content }
    get createdAt() { return this.data.createdAt }
    get updatedAt() { return this.data.updatedAt }
}