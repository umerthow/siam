import { Database, EventLogger } from './Interfaces'

export default class ActionLogger implements EventLogger {
    constructor(private provider: Database) {
        this.provider = provider
    }

    public logInfo(msg: string): void {
        console.log(msg)
    }

    public middlewareLog(params: any) {
        this.provider
    }
}