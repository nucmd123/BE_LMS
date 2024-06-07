import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './passport/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './passport/jwt.strategy'
import { UsersModule } from '../users/users.module'
import { KeyTokenService } from './key-token.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KeyToken } from './entities/key-token.entity'
import { MailModule } from '../mail/mail.module'

export const JWT_SECRET = 'secret'

@Module({
  controllers: [AuthController],
  providers: [AuthService, KeyTokenService, LocalStrategy, JwtStrategy],
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([KeyToken]), UsersModule, PassportModule, MailModule],
})
export class AuthModule {}
