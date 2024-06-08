import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  static firstNameMinLength: number = 1
  static firstNameMaxLength: number = 25

  static lastNameMinLength: number = 1
  static lastNameMaxLength: number = 25

  static passwordMinLength: number = 8
  static passwordMaxLength: number = 16

  @IsString()
  @MinLength(CreateUserDto.firstNameMinLength)
  @MaxLength(CreateUserDto.firstNameMaxLength)
  firstName: string

  @IsString()
  @MinLength(CreateUserDto.lastNameMinLength)
  @MaxLength(CreateUserDto.lastNameMaxLength)
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(CreateUserDto.passwordMinLength)
  @MaxLength(CreateUserDto.passwordMaxLength)
  password: string
}
