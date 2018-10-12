class Product {
    private data: any;

    constructor(data: Object) {
        this.data = data;
    }

    get id() { return this.data.id }
}