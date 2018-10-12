import { roleDummy } from './dummy'

import RoleMapping from '../../domain/Role/RoleMapping'
import RoleEntity from '../../domain/Role/RoleEntity'

import {assert} from 'chai'



describe("Role Mapping", () => {
    describe(".build", () => {
        it.skip("it should return Role Entity and valid value properties", () => {
            const perm = new RoleMapping({} as any)
            const entity = perm.build(roleDummy)

            assert(entity instanceof RoleEntity, 'Invalid instance')

            assert(entity.id === 1, 'invalid id')
            assert(entity.label === "staff", 'invalid label')
            assert(entity.status === false, 'invalid status')
        })
    })

})