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
  Query,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { ParseIdPipe } from 'src/pipes/parse-id/parse-id.pipe'
import { ResponseMessage } from 'src/decorators/response-message.decorator'
import { ReqUser } from 'src/decorators/user.decorator'
import { User } from './entities/user.entity'
import { existsSync, unlinkSync } from 'fs'
import AvatarInterceptor, { AVATAR_IMG_DIR } from './avatar-upload.interceptor'
import { ApiTags } from '@nestjs/swagger'
import PaginationQueryDto from '../courses/dto/pagination-query.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // [get] find all user /api/v1/users
  @Get()
  @ResponseMessage('Find all user ok')
  async find(@Query() query: PaginationQueryDto) {
    return await this.usersService.find({ query })
  }

  // [get] get profile /api/v1/users/profile
  @Get('profile')
  @ResponseMessage('Get profile ok')
  async profile(@ReqUser() user: User) {
    return { user }
  }

  // [get] post-avatar /api/v1/users/profile/post-avatar
  @Patch('profile/change-avatar')
  @UseInterceptors(AvatarInterceptor('avatar'))
  @ResponseMessage('Cập nhật hình đại diện thành công')
  async postAvatar(@ReqUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Không có hình ảnh được cung cấp')
    }

    // Xoá avatar cũ trong server
    if (user.avatar) {
      const odlAvatarPath = `${AVATAR_IMG_DIR}/${user.avatar}`

      if (existsSync(odlAvatarPath)) {
        unlinkSync(odlAvatarPath)
      }
    }

    // update
    const userUpdate = await this.usersService.updateById({
      id: user.id,
      updateUserDto: { avatar: file.filename },
    })
    // const userUpdate = await this.usersService.updateById(user.id, { avatar: file.filename })

    return { user: userUpdate }
  }

  @Delete('profile/remove')
  @ResponseMessage('Người dùng đã được xoá')
  async removeProfile(@ReqUser() user: User) {
    return await this.usersService.removeUser({ user })
  }

  @Patch('profile/update')
  @ResponseMessage('Cập nhật thành công')
  async update(@ReqUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    delete updateUserDto['avatar']
    return await this.usersService.updateById({
      id: user.id,
      updateUserDto,
    })
  }

  @Patch('profile/change-password')
  async changPassword(@Body() updateUserDto: UpdateUserDto, @ReqUser() user: User) {
    const { password, newPassword } = updateUserDto
    await this.usersService.changePassword({ password, newPassword, user })
  }
}
