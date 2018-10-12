import { permDummy } from './dummy'
import PermMapping from '../../domain/Permission/PermMapping'
import PermEntity from '../../domain/Permission/PermEntity'

import {assert} from 'chai'


describe("Perm Mapping", () => {
    describe(".populate", () => {

        it.skip("it should return Permission Entity and valid value properties", () => {
            const perm = new PermMapping(permDummy)
            const entity = perm.populate()

            assert(entity instanceof PermEntity, 'Invalid instance')

            assert(entity.id === 1, 'invalid return id')
            assert(entity.controller === "Permission label", 'invalid return label')
            assert(entity.perm === 0xff, 'invalid permission return')

        })

    })
})