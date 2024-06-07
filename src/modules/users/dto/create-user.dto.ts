import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  static passwordMinLength: number = 8
  static passwordMaxLength: number = 16

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(CreateUserDto.passwordMinLength)
  @MaxLength(CreateUserDto.passwordMaxLength)
  password: string
}
