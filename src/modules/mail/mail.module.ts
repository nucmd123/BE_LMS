import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailController } from './mail.controller'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            secure: false,
            auth: {
              user: configService.get<string>('MAIL_AUTH_USER'),
              pass: configService.get<string>('MAIL_AUTH_PASS'),
            },
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          preview: configService.get<string>('MAIL_PREVIEW') === 'TRUE' ? true : false,
        }
      },
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
