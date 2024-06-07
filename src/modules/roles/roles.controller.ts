import { Controller, Get, Body, Patch, Param } from '@nestjs/common'
import { RolesService } from './roles.service'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ParseIdPipe } from 'src/pipes/parse-id/parse-id.pipe'
import { RoleEnum } from 'src/modules/roles/enums/RoleEnum'
import { Roles } from 'src/decorators/roles.decorator'
import { ResponseMessage } from 'src/decorators/response-message.decorator'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Post('create')
  // async create(@Body() createRoleDto: CreateRoleDto) {
  //   return await this.rolesService.create(createRoleDto)
  // }

  @Get()
  async findAll() {
    return await this.rolesService.findAll()
  }

  @Get(':id/all-user')
  async findAllUserByRoleID(@Param('id', ParseIdPipe) id: number) {
    return await this.rolesService.findAllUserByRoleId(id)
  }

  @Get(':id')
  findOneById(@Param('id', ParseIdPipe) id: number) {
    return this.rolesService.findOneById(id)
  }

  // @UseGuards(RolesGuard)
  @Patch(':id')
  @Roles(RoleEnum.ROOT, RoleEnum.ADMIN)
  @ResponseMessage('Role update ok')
  async updateById(@Param('id', ParseIdPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return { role: await this.rolesService.updateById(id, updateRoleDto) }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id)
  // }
}
