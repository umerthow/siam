import UserMapping from '../../domain/User/UserMapping'
import UserEntity from '../../domain/User/UserEntity'
import {userDummy} from './dummy'
import { assert } from 'chai'
import validator from 'validator'

import { LoggerInterface, Translation } from '../../infrastructures/Interfaces'


class LoggerMock implements LoggerInterface {
    info(msg: string) {}
    error(msg: string) {}
}

class TransMock implements Translation {
    initLanguage(locale: string) {}
    initDictionary() {}
    translate(code: string, msg: string) : any  {
        return { msgCode: code, msg: msg }
    }
}

describe("UserMapping Testing", () => {
    let mappingDummy = {
        logger: new LoggerMock(),
        translator: new TransMock(),
        validator:  validator,
        config: {}
    }

    describe(".populate", () => {
        it("it should return User Entity and valid value properties", () => {
            const mapping = new UserMapping(mappingDummy)
            const entity = mapping.build(userDummy)
            
            assert(entity instanceof UserEntity, 'Invalid instance')
            assert(entity.id === 1, "Invalid id")
            assert(entity.firstName === "first-name", "Invalid first name data")
            assert(entity.lastName === "last-name", "Invalida last name data")
            assert(entity.email === "name-1@email.test", "Invalida email data")
            assert(entity.password === "password", "Invalida password data")
            assert(entity.salt === "salt", "Invalida salt data")
            
            assert(new Date(entity.lastLogin).getTime() === 1530810000000, "Invalid last login data")
            assert(new Date(entity.createdAt).getTime() === 1530810000000, "Invalid created at data")
            assert(new Date(entity.updatedAt).getTime() === 1530810000000, "Invalid updated at data")
        })
    })
    
    describe(".validate", () => {
        describe("If required field is not in request", () => {
            it("return", () => {
                let mapping = new UserMapping(mappingDummy)
                let data = Object.assign({}, userDummy)
                
                delete data.first_name
                delete data.last_name
                delete data.email
                delete data.password
                delete data.group
                
                let err = mapping.validate(data)
                assert(err.msgCode === 'user.validation.required_error', 'Invalid required validation')
            })
        })

        describe("If not valid email is given", () => {
            it("it must return invalid email error", () => {
                
                let mapping = new UserMapping(mappingDummy)
                let data = Object.assign({}, userDummy)
                
                data.email = '123132132312'
                let err = mapping.validate(data)
                assert(err.msgCode === 'user.validation.email_not_valid', 'Invalid email validation')
            })
        })
    })
})