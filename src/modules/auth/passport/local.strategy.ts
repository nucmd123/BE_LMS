import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { validateOrReject } from 'class-validator'
import { plainToClass } from 'class-transformer'
import SigninLocalDto from '../dto/signin-local.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string) {
    // validatiom email and password
    const signinLocalDto = plainToClass(SigninLocalDto, { email, password })
    try {
      await validateOrReject(signinLocalDto)
    } catch (error) {
      throw error
    }

    const user = await this.authService.authenLocal(email, password)
    if (!user) {
      throw new UnauthorizedException('Email or password incorrect')
    }
    return user
  }
}
