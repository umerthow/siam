import RoleModel from './Role.model'

import { Model, Table, Column, 
         DeletedAt, CreatedAt, UpdatedAt,
         Unique, 
         BelongsTo,
         ForeignKey} from 'sequelize-typescript'


@Table({
    tableName: 'users_users',
    underscored: true
})
export default class UserModel extends Model<UserModel> {
    @Column({ primaryKey: true})
    id!: number;

    @Column
    first_name!: string;

    @Column
    last_name!: string;

    @Unique
    @Column
    email!: string;

    @Column
    password!: string;

    @Column
    salt!: string;

    @Column
    phone!: string;

    @ForeignKey(() => RoleModel)
    @Column
    role_id!: number;

    @Column
    confirmed_at!: Date; 

    @Column
    last_login!: Date;
    
    @Column
    status!: string;

    @DeletedAt
    deleted_at!: Date;

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;

    @BelongsTo(() => RoleModel)
    role!: RoleModel
}