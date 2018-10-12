import { RoleUseCase } from '../../domain/Role/RoleUseCase'
import {assert} from 'chai'

class DBClass {
    constructor(public params: any) {
        this.params = params
    }
    fetchOne() {
        return Promise.resolve(this.params)
    }

    update(obj: any) {
        return Promise.resolve(obj)
    }
}

describe("Role UseCase", () => {
    let RoleUC: any
    
    describe("Permission testing", () => {
        describe("Add permission", () => {
            describe("Assume, current permission is 0x00", () => {
                it("add new permission 0x02", async () => {
                    let DBase = new DBClass({ error: false, data: {id: 2, perms: 0x02} })
                    RoleUC = new RoleUseCase({ database: DBase } as any)

                    let data = await RoleUC.addPermission(2, 0x02)
                    assert(data.perms === 0x2, `it must be 0x2 but we got 0x${data.perms.toString(16)}`)
                })
            })

            describe("Assume, current permission is 0x08", () => {
                it("add new permission 0x02 permission", async () => {
                    let DBase = new DBClass({ error: false, data: {id: 2, perms: 0x08} })
                    RoleUC = new RoleUseCase({ database: DBase } as any)

                    let data = await RoleUC.addPermission(2, 0x02)
                    assert(data.perms === 0xa, `it must be 0xa but we got 0x${data.perms.toString(16)}`)
                })
            })
        })
        

        describe("Remove permission", () => {
            describe("Assume, current permission is 0x0F", () => {
                it("Remove permission by 0x02", async () => {
                    let DBase = new DBClass({ error: false, data: {id: 2, perms: 0x0F} })
                    RoleUC = new RoleUseCase({ database: DBase } as any)

                    let data = await RoleUC.removePermission(2, 0x02)
                    assert(data.perms === 0xD, `it must be 0x0D but we got 0x${data.perms.toString(16)}`)
                })
            })

            describe("Assume, current permission is 0xFF", () => {
                let DBase: any
                beforeEach(() => {
                    DBase = new DBClass({ error: false, data: {id: 2, perms: 0xFF} })
                    RoleUC = new RoleUseCase({ database: DBase } as any)
                })
                it("Remove permission by 0x08", async () => {
                    let data = await RoleUC.removePermission(2, 0x08)
                    assert(data.perms === 0xF7, `it must be 0xF7 but we got 0x${data.perms.toString(16)}`)
                })

                it("Remove permssion by 0x02", async () => {
                    let data = await RoleUC.removePermission(2, 0x02)
                    assert(data.perms === 0xFD, `it must be 0xFC but we got 0x${data.perms.toString(16)}`)
                })
            })
        })

    })

})