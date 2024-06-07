import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async userVerify(toEmail: string, opts?: ISendMailOptions) {
    return await this.mailerService.sendMail({
      to: toEmail,
      from: `"LMS" <${this.configService.get<string>('MAIL_AUTH_USER')}>`,
      subject: 'Verify email',
      template: 'userVerify',
      context: {
        ...opts.context,
      },
    })
  }
}
