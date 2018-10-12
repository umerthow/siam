import { Database } from '../../infrastructures/Interfaces'

export default class PageUseCase {
    private adapter: Database

    constructor(adapter: Database) {
        this.adapter = adapter
    }

    findByID(key: string | number) {
        return this.adapter.fetch(key)
    }
}
