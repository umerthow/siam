import Auth from '../../infrastructures/Auth'
import { AuthProviderInterface } from '../../infrastructures/Interfaces'
import { Encryption } from '../../infrastructures/Encryptor'

import sinon from 'sinon'
import { assert } from 'chai'

class Perms {
    fetchBy() {}
}

describe("Auth Testing", () => {
    let auth: any
    let permProv: any

    beforeEach(() => {
        permProv = new Perms()
        auth = new Auth({} as AuthProviderInterface, {} as Encryption, {}, permProv)
    })
    describe(".checkPrivileges", () => {
        describe("Given 0x0F permission action for a user", () => {
            describe("Check authorized with if action has 0x08 perm", ()=> {
                it("User should allowed to access action", async () => {
                    sinon.stub(permProv, 'fetchBy').callsFake(() => {
                        return Promise.resolve({
                            error: false,
                            data: {
                                id: 1,
                                controller: 'user',
                                action: 'index',
                                perm: "0x8"
                            }
                        })
                    })
                    sinon.stub(auth, 'tokenParser').returns({
                        id: 1,
                        name: 'admin',
                        permission: "0x0F"
                    })
                    
                    let result = await auth.checkPrivileges('token', 'admin', 'index')
                    assert(result === true, "Invalid permission result")
                })
            })
        })


        describe("Given 0x04 permission action for a user", () => {
            describe("Check authorized with if action has 0x08 perm", ()=> {
                it("User should allowed to access action", async () => {
                    sinon.stub(permProv, 'fetchBy').callsFake(() => {
                        return Promise.resolve({
                            error: false,
                            data: {
                                id: 1,
                                controller: 'user',
                                action: 'index',
                                perm: "0x8"
                            }
                        })
                    })
                    sinon.stub(auth, 'tokenParser').returns({
                        id: 1,
                        name: 'admin',
                        permission: "0x04"
                    })
                    
                    let result = await auth.checkPrivileges('token', 'admin', 'index')
                    assert(result === false, "Invalid permission result")
                })
            })
        })
    })
})