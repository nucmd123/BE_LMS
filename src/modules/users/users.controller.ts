import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { ParseIdPipe } from 'src/pipes/parse-id/parse-id.pipe'
import { ResponseMessage } from 'src/decorators/response-message.decorator'
import { ReqUser } from 'src/decorators/user.decorator'
import { User } from './entities/user.entity'
import { existsSync, unlinkSync } from 'fs'
import { AVATAR_DIR } from 'src/constants'
import AvatarInterceptor from './avatar-upload.interceptor'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // [get] find all user /api/v1/users
  @Get()
  @ResponseMessage('Find all user ok')
  async findAll() {
    return { users: await this.usersService.findAll() }
  }

  // [get] get profile /api/v1/users/profile
  @Get('profile')
  @ResponseMessage('Get profile ok')
  async profile(@ReqUser() user: User) {
    return { user }
  }

  // [get] post-avatar /api/v1/users/profile/post-avatar
  @Post('profile/post-avatar')
  @UseInterceptors(AvatarInterceptor('avatar'))
  @ResponseMessage('Post avatar ok')
  async postAvatar(@ReqUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No avatar file provided')
    }

    if (user.avatar) {
      const odlAvatarPath = `${AVATAR_DIR}/${user.avatar}`

      if (existsSync(odlAvatarPath)) {
        unlinkSync(odlAvatarPath)
      }
    }

    const userUpdate = await this.usersService.updateById(user.id, { avatar: file.filename })

    return { user: userUpdate }
  }

  @Get(':id')
  findOneById(@Param('id', ParseIdPipe) id: number) {
    return this.usersService.findOneById(id)
  }

  @Patch(':id')
  async update(@Param('id', ParseIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateById(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string) {
    return this.usersService.softRemoveById(+id)
  }
}
