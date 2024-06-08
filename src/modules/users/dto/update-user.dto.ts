import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

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
}
