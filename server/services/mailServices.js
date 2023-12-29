const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

class MailService {
    transporter = null
    constructor() {
        dotenv.config()
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link, name) {
        const inner = `
            <div style="padding: 32px 0px 24px 0px; ">
                <p>Hi ${name},</p>
                <p style="padding: 12px 0 24px 0;">Thank you for creating an Cloud Storagy account.<br /> 
                    Before you get started, please verify your email.</p>
                <a style="background: #0066FF; padding: 10px 32px; border-radius: 50px; color: #ffffff;  text-decoration: none;"
                    href="${process.env.BACK_END_HOST + '/active/' + link}">Verify account</a>
                <p style="padding-top: 32px; margin: 0;">Best regards,</p>
                <p style="margin: 0;">Developer Andrey Oleynik</p>
            </div>
        `

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation on Cloud Storage',
            text: '',
            html: getTemplate(inner)
                
        })
    }
}

function getTemplate(inner) {
    return `
        <body>
            <style>
                body {
                    margin: 0;
                    line-height: inherit;
                }
            </style>
            <div style="background: #dadada; position: relative; width: 100%; box-sizing: border-box; margin: 0; padding: 24px 8px 48px 8px; font-size: 16px; line-height: 1.35; ">
                <div
                    style="margin: 0 auto; max-width: 576px; border-radius: 12px; background: #FFFFFF; padding: 32px; border: solid 1px #F3F3F8; text-align: left;">
                    <h1>Cloud Storagy</h1>
                    
                    ${inner}

                    <hr style="border: solid 0.5px #f3f3f8;" />

                    <div style="font-size: 14px; padding-top: 24px;">
                        <div>
                            <p style="margin: 0; padding-right: 2px; padding-bottom: 2px; display: inline-block;">Have any
                                question or need help?</p>
                            <a style="display: inline-block; color: #0066ff; text-decoration: none;"
                                href="mailto:andrey.cloud.storagy@gmail.com">Contact support &rarr;</a></p>
                        </div>
                    </div>
                </div>
                <div
                    style="display: block; margin: 0 auto; padding-top: 32px; text-align: center; font-size: 14px;">
                    <p>Copyright &copy; 2023-2024 Cloud Storagy</p>
                    <p>Visit us at 
                        <a href="https://cloud-storage-seven.vercel.app/" target="_blank" style=" text-decoration: none; color: #000000">cloud-storage.app</a>
                    </p>
                </div>

            </div>
        </body>
    `
}

module.exports = new MailService();