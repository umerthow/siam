import UserModel from './User.model'

import { Model, Table, Column,
    DeletedAt, CreatedAt, UpdatedAt,
    HasMany} 
    from 'sequelize-typescript'

@Table({
    tableName: 'users_roles',
    underscored: true
})

export default class RoleModel extends Model<RoleModel> {
    @Column({ primaryKey: true})
    id!: number

    @Column
    label!: string

    @Column
    description!: string

    @Column
    status!:number

    @Column
    perms!: number

    @DeletedAt
    deleted_at!: Date

    @CreatedAt
    created_at!: Date

    @UpdatedAt
    updated_at!: Date

    @HasMany(() => UserModel)
    users!: UserModel[]
}