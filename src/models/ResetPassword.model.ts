import { Model, Table, Column, 
    CreatedAt, UpdatedAt,
    Unique } from 'sequelize-typescript'


@Table({
    tableName: 'users_reset_passwords',
    underscored: true
})

export default class ResetPasswordModel extends Model<ResetPasswordModel> {
    @Column({ primaryKey: true})
    id!: number;

    @Column
    user_id!: string;

    @Column
    token!: string;

    @Unique
    @Column
    expired_at!: Date;

    @Column
    confirmed_at!: Date;

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;
}