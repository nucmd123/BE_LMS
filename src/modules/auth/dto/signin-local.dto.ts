import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto'

export default class SigninLocalDto {
  @IsEmail()
  @ApiProperty({ example: 'thai1@gmail.com', description: 'email' })
  email: string

  @IsString()
  @MinLength(CreateUserDto.passwordMinLength)
  @MaxLength(CreateUserDto.passwordMaxLength)
  @ApiProperty({ example: '123456789', description: 'email' })
  password: string
}
