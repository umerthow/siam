// import { assert } from 'chai'

import RoleService from '../../services/RoleService'
import { ServiceConstructorInterface } from '../../Services/Service'
import { UserUseCaseInterface } from '../../domain/user/UserUsecase'
import RoleServiceInterface from '../../infrastructures/interface/role.service.interface'
import { UseCaseInterface } from '../../domain/UseCase';



describe("Role Service", () => {
    let roleSVC: RoleServiceInterface

    beforeEach(() => {
        roleSVC = new RoleService({} as UseCaseInterface, {} as UserUseCaseInterface, {} as ServiceConstructorInterface)
        roleSVC
    })

   
    
}) 