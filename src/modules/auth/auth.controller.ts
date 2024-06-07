import { Controller, Post, Body, UseGuards, HttpStatus, HttpCode, Get, Headers, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Public } from 'src/decorators/public.decorator'
import { ReqUser } from 'src/decorators/user.decorator'
import { ResponseMessage } from 'src/decorators/response-message.decorator'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { User } from '../users/entities/user.entity'
import { RoleEnum } from '../roles/enums/RoleEnum'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import SigninLocalDto from './dto/signin-local.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- TEACHER ---
  @Public()
  @ResponseMessage('Sign up teacher ok')
  @Post('signup/teacher')
  async signupTeacher(@Req() req, @Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(req, createUserDto, RoleEnum.TEACHER)
  }

  // --- STUDENT ---
  @Public()
  @Post('signup/student')
  @ResponseMessage('Sign up student ok')
  async signupStudent(@Req() req, @Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(req, createUserDto, RoleEnum.STUDENT)
  }

  @Public()
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Sign in ok')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SigninLocalDto })
  async signinStudent(@ReqUser() user: User) {
    return this.authService.signin(user)
  }

  @Post('signout')
  @ResponseMessage('Sign out ok')
  async signout(@ReqUser() user: User) {
    return await this.authService.signout(user)
  }

  // @Public()
  // @ResponseMessage('Signin ok')
  // @Post('googleSignin')
  // async googleSigninStudent(@Body('access_token') access_token: string) {
  //   return await this.authService.googleSignin(access_token)
  // }

  @Get('refresh')
  @Public()
  @ResponseMessage('refresh token ok')
  async handleRefreshToken(@Headers('rt') refreshToken: string) {
    return await this.authService.processNewToken(refreshToken)
  }
}
