import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createTransport, Transporter as NodemailerTransporter } from "nodemailer"
import { renderFile } from "pug"

@Injectable()
export class MailingService {
  private transporter: NodemailerTransporter

  constructor(configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get<string>("MAIL_HOST"),
      port: configService.get<number>("MAIL_PORT"),
      secure: false,
      auth: {
        user: configService.get<string>("MAIL_USER"),
        pass: configService.get<string>("MAIL_PASSWORD"),
      },
    })
  }

  async sendMail(subject: string, template: string, data: any) {
    const mailOptions = {
      from: "techblog@company.com",
      to: data.email,
      subject,
      html: renderFile(__dirname + `/templates/${template}.pug`, { data }),
    }

    try {
      const result = await this.transporter.sendMail(mailOptions)
      console.log("🚀 ~ MailingService ~ sendMail ~ result:", result)
      return result
    } catch (error) {
      console.log(error)
    }
  }
}
