import { IsEnum, IsOptional, IsString } from 'class-validator'
import { RoleEnum } from 'src/modules/roles/enums/RoleEnum'

export class CreateRoleDto {
  @IsEnum(RoleEnum)
  name: RoleEnum

  @IsOptional()
  @IsString()
  description?: string
}
