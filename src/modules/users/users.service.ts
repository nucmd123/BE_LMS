import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { hash } from 'src/utils/hashAndCompare'
import { RolesService } from '../roles/roles.service'
import { RoleEnum } from 'src/modules/roles/enums/RoleEnum'
import PaginationQueryDto from '../courses/dto/pagination-query.dto'
import paginationMeta from 'src/utils/paginationMeta'

type IFindUsers = { query: PaginationQueryDto }
type IRemoveUser = { user: User }
type IUpdateById = { id: number; updateUserDto?: UpdateUserDto }

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

  async find({ query }: IFindUsers) {
    const page = query.page || 1 // số trang
    const limit = query.limit || 10 // số item 1 trang
    // const users = await this.usersRepository.find()
    // return users

    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      meta: paginationMeta({ limit, page, total }),
      users,
    }
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email }, relations: { role: true } })
    return user
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: { role: true } })
    if (!user) {
      throw new NotFoundException('User can not found')
    }
    return user
  }

  async updateById({ id, updateUserDto }: IUpdateById) {
    const user = await this.findOneById(id)

    if (!user) {
      throw new BadRequestException('User can not found')
    }

    // user.emailVerified = true
    Object.assign(user, updateUserDto)

    return await this.usersRepository.save(user)
  }

  async removeUser({ user }: IRemoveUser) {
    await this.usersRepository.softRemove(user)
    return
  }
}
