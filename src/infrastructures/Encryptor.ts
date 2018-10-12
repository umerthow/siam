import bcrypt from 'bcrypt'

export interface Encryption {
    genSalt(round?: number): string
    encrypt(password: string, salt: string) : string
    compare(plainPass: string, encPass: string): Promise<Boolean>
}


export class Encryptor implements Encryption {

    public genSalt(): string {
        return bcrypt.genSaltSync()
    }

    public async compare(password: string, hash: string): Promise<Boolean> {
        hash = hash || ""
        password = password || ""
        return bcrypt.compare(password, hash)  
    }

    public encrypt(password: string, salt: string): string {
        return bcrypt.hashSync(password, salt)
    }
}