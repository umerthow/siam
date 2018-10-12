import Translator from '../../infrastructures/Translator'
import { assert } from 'chai'

class TransTest extends Translator {
    constructor() {
        super('test.json', () => {})
        this.dictionary = {
            user: {
                validate: {
                    error: 'this is {username} and this is {email}'
                }
            }
        }
    }
    get dictionaries() {
        return this.dictionary
    }
}

describe("Translator testing", () => {

    describe(".translate", () => {
        let trans : any

        before(() => {
            trans = new TransTest()
        })

        describe("when code is not in list", () => {
            it("it should return default msg", () => {
                let msg = trans.translate("test.test", "default message here")
                assert(msg.msg === "default message here", "Translation return invalid default message")
            })
        })

        describe("If given code 'user.validate.error' with {username} and {email} as params", () => {
            it("it must return message with username and email", () => {
                let msg = trans.translate('user.validate.error', "default message here", { username: 'admin', email: 'engineer@email.mail'})
                assert(msg.msg === "this is admin and this is engineer@email.mail",  "Invalid translate message")
            })

            it("it must return replaced string username by admin and email by engineer@email.mail", () => {
                let msg = trans.translate('user.validate.error', "default message here", { username: 'admin', email: 'engineer@email.mail'})
                assert(msg.msg === "this is admin and this is engineer@email.mail",  "Invalid translate message")
            })
        })
    })

})