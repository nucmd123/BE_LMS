import { Injectable } from '@nestjs/common'
import { UpdateRoleDto } from './dto/update-role.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './entities/role.entity'
import { RoleEnum } from 'src/modules/roles/enums/RoleEnum'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  /*   async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { name: createRoleDto.name } })
    if (role) {
      throw new BadRequestException('Role already exists')
    }
    return await this.roleRepository.save(
      this.roleRepository.create({
        ...createRoleDto,
      }),
    )
  }
 */

  async findAll() {
    return await this.roleRepository.find()
  }

  async findAllUserByRoleId(roleId: number) {
    const roleUser = await this.roleRepository.findOne({ where: { id: roleId }, relations: { users: true } })
    return roleUser
  }

  async findOneById(id: number) {
    return await this.roleRepository.findOne({ where: { id } })
  }

  async findOneByName(name: RoleEnum) {
    return await this.roleRepository.findOne({ where: { name } })
  }

  async updateById(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } })
    role.description = updateRoleDto.description
    return role
  }

  /*   remove(id: number) {
    return `This action removes a #${id} role`
  }
 */
}
