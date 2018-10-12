export interface ResetInterface {
    id: number | string
    userId: number | string
    token: string
    expiredAt: string | number
    resetedAt: string | number
    createdAt: string | number
    updatedAt: string | number
    confirmedAt: string | number
}


export default class ResetEntity implements ResetInterface {
    constructor(private data: any) {
        this.data = data
    }

    get id(): number | string { return this.data.id }
    get userId(): number | string { return this.data.user_id }
    set userId(value) {
        if (value) {
            this.data.user_id = value
        }
    }

    get token(): string { return this.data.token }
    set token(value) {
        if (value) {
            this.data.token = value
        }
    }

    get expiredAt(): string | number { return this.data.expired_at }
    get resetedAt(): string | number { return this.data.reseted_at }
    get createdAt(): string | number { return this.data.created_at }
    get updatedAt(): string | number { return this.data.updated_at }
    get confirmedAt(): string | number { return this.data.confirmed_at }
    set confirmedAt(value) {
        if (value) {
            this.data.confirmed_at = value
        }
    }

}
