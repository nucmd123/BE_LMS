import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { DataSource } from 'typeorm'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { RolesModule } from './modules/roles/roles.module'
import { DatabaseModule } from './modules/database/database.module'
import { MailModule } from './modules/mail/mail.module'
import { CourseModule } from './modules/courses/course.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    MailModule,
    CourseModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
