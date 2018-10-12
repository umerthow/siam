import nodemailer from 'nodemailer'

export class Mailer {
    private transport: any
    private options: any
    private from: any

    constructor(params: any) {
        this.from = params.from
        this.options = {
            host: params.host,
            port: params.port,
            auth: {
                user: params.username,
                pass: params.password
            }
        }
        this.transport = nodemailer.createTransport(this.options)
    }

    public async send(params: any) {
        const mailOptions = { 
            from : this.from, 
            to : params.email, 
            subject: params.subject, 
            text: params.msg
        };
        
        console.log(params.msg)
        await this.transport.sendMail(mailOptions, (err:any, info:any) => {
            console.log(err)
            console.log(info)    
        })
    }
}