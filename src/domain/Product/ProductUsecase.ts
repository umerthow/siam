import { Database } from '../../infrastructures/Interfaces'

class ProductUsecase  {
    private adapter: Database;

    constructor(adapter: Database) {
        this.adapter = adapter
    }

    save(): void {
        this.adapter
    }
    update(): void {}
    getAll(): void {}
}

export default ProductUsecase