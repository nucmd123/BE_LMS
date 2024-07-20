import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  lastName?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  avatar?: string

  @IsOptional()
  @IsString()
  @MinLength(CreateUserDto.passwordMinLength)
  @MaxLength(CreateUserDto.passwordMaxLength)
  password?: string

  @IsOptional()
  @IsString()
  @MinLength(CreateUserDto.passwordMinLength)
  @MaxLength(CreateUserDto.passwordMaxLength)
  newPassword?: string
}
