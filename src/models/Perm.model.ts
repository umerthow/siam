import { Model, Table, Column,
        CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript'

@Table({
    tableName: 'users_roles_permissions',
    underscored: true
})

export default class PermModel extends Model<PermModel> {
    @PrimaryKey
    @Column
    id!: number

    @Column
    controller!: string

    @Column
    action!: string

    @Column
    perm!: number
    
    @Column
    status!: number

    @CreatedAt
    created_at!: Date

    @UpdatedAt
    updated_at!: Date
}