import { BadRequestException, Injectable, Req } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { compare } from 'src/utils/hashAndCompare'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { User } from '../users/entities/user.entity'
import { RoleEnum } from '../roles/enums/RoleEnum'
import { KeyTokenService } from './key-token.service'
import { ConfigService } from '@nestjs/config'
import { ITokenPayload } from 'src/interfaces/ITokenPayload'
import { MailService } from '../mail/mail.service'
import { Request } from 'express'

@Injectable()
export class AuthService {
  private JWT_ACCESS_TOKEN_SECRET: string
  private JWT_ACCESS_TOKEN_EXPIRE: string
  private JWT_REFRESH_TOKEN_SECRET: string
  private JWT_REFRESH_TOKEN_EXPIRE: string

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private keyTokenService: KeyTokenService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {
    this.JWT_ACCESS_TOKEN_SECRET = configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
    this.JWT_ACCESS_TOKEN_EXPIRE = configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE')
    this.JWT_REFRESH_TOKEN_SECRET = configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
    this.JWT_REFRESH_TOKEN_EXPIRE = configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')
  }

  async authenLocal(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email)

    if (user && (await compare(password, user.password))) {
      return user
    }

    return null
  }

  verifyToken(token: string): ITokenPayload | Promise<ITokenPayload> {
    try {
      const decode: ITokenPayload = this.jwtService.verify(token, {
        secret: this.JWT_REFRESH_TOKEN_SECRET,
      })
      return decode
    } catch (error) {
      throw new BadRequestException(`Invalid token. You need sign in`)
    }
  }

  signToken(user: User, opts: JwtSignOptions) {
    const payload = { email: user.email, sub: user.id }

    return this.jwtService.sign(payload, opts)
  }

  signTokenPair(user: User) {
    const accessToken = this.signToken(user, {
      secret: this.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: this.JWT_ACCESS_TOKEN_EXPIRE,
    })
    const refreshToken = this.signToken(user, {
      secret: this.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: this.JWT_REFRESH_TOKEN_EXPIRE,
    })

    return { accessToken, refreshToken }
  }

  async signup(req: Request, createUserDto: CreateUserDto, roleName: RoleEnum) {
    const user = await this.usersService.create(createUserDto, roleName)

    const tokenPair = this.signTokenPair(user)
    await this.keyTokenService.saveKeyToken(tokenPair.refreshToken, user) // save keyToken into db

    const sendVerify = await this.mailService.userVerify(user.email, {
      context: {
        verifyLink: `${req.protocol}://${req.headers.host}`,
        name: `${user.firstName} ${user.lastName}`,
      },
    })

    return {
      user,
      tokens: tokenPair,
    }
  }

  async signin(user: User) {
    const tokenPair = this.signTokenPair(user)
    await this.keyTokenService.saveKeyToken(tokenPair.refreshToken, user)
    return {
      user,
      tokens: tokenPair,
    }
  }

  async signout(user: User) {
    await this.keyTokenService.deleteRefreshToken(user)
    return
  }

  async googleSignin(access_token: string) {
    // userService.findOneByEmail
    // if not found user
    // -- create user
    // else return user
    return `This action sign in user with google`
  }

  async processNewToken(refreshToken: string) {
    await this.verifyToken(refreshToken)

    const keyToken = await this.keyTokenService.findByRefreshToken(refreshToken)
    const user = keyToken.user
    const tokenPair = this.signTokenPair(user)

    await this.keyTokenService.saveKeyToken(tokenPair.refreshToken, user)

    return {
      user,
      tokens: tokenPair,
    }
  }
}
