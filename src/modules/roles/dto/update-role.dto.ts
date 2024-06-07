import { PickType } from '@nestjs/mapped-types'
import { CreateRoleDto } from './create-role.dto'

export class UpdateRoleDto extends PickType(CreateRoleDto, ['description' as const]) {}
