import { Controller, Get } from '@nestjs/common'
import { MailService } from './mail.service'
import { ResponseMessage } from 'src/decorators/response-message.decorator'
import { MailerService } from '@nestjs-modules/mailer'
import { Public } from 'src/decorators/public.decorator'
import { ConfigService } from '@nestjs/config'

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Test mail')
  async sendMail() {
    return await this.mailService.userVerify('huythaia123@gmail.com')
  }
}
