import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { hash } from 'src/utils/hashAndCompare'
import { RolesService } from '../roles/roles.service'
import { RoleEnum } from 'src/modules/roles/enums/RoleEnum'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto, roleName: RoleEnum = RoleEnum.STUDENT): Promise<User> {
    const user = await this.findOneByEmail(createUserDto.email)

    const userRole = await this.rolesService.findOneByName(roleName)

    if (user) {
      throw new BadRequestException('Email already in use')
    }

    return await this.usersRepository.save(
      this.usersRepository.create({
        ...createUserDto,
        password: await hash(createUserDto.password),
        role: userRole,
      }),
    )
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find()
    return users
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email }, relations: { role: true } })
    return user
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: { role: true } })
    if (!user) {
      throw new BadRequestException('User can not found')
    }
    return user
    // return await this.usersRepository.findOne({ where: { id } })
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    // const user = await this.usersRepository.findOneBy({ id })
    const user = await this.findOneById(id)

    if (!user) {
      throw new BadRequestException('User can not found')
    }

    // user.emailVerified = true
    Object.assign(user, updateUserDto)

    return await this.usersRepository.save(user)
  }

  async softRemoveById(id: number) {
    const user = await this.usersRepository.findOneBy({ id })

    if (!user) {
      throw new BadRequestException('User can not found')
    }

    return this.usersRepository.softRemove(user)
  }
}
