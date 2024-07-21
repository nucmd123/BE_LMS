import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common'
import { CourseService } from './course.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'
import { ReqUser } from 'src/decorators/user.decorator'
import { User } from '../users/entities/user.entity'
import { Roles } from 'src/decorators/roles.decorator'
import { RoleEnum } from '../roles/enums/RoleEnum'
import CourseImageInterceptor from './course-image.interceptor'
import { Public } from 'src/decorators/public.decorator'
import PaginationQueryDto from './dto/pagination-query.dto'
import { ParseIdPipe } from 'src/pipes/parse-id/parse-id.pipe'
import { ResponseMessage } from 'src/decorators/response-message.decorator'

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // api không yê cầu đăng nhập
  @Get('find')
  @Public()
  async find(@Query() query: PaginationQueryDto) {
    return {
      ...(await this.courseService.find({ query })),
    }
  }

  // api không yê cầu đăng nhập
  @Get('find-one/:id')
  @Public()
  async findOne(@Param('id', ParseIdPipe) id: number) {
    return { ...(await this.courseService.findOne({ id })) }
  }

  @Post('create')
  @Roles(RoleEnum.TEACHER)
  @UseInterceptors(CourseImageInterceptor('image'))
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @ReqUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.courseService.create({
      createCourseDto: {
        ...createCourseDto,
        image: file?.filename,
      },
      user,
    })

    return
  }

  @Get('find-course-by-teacher')
  @Roles(RoleEnum.TEACHER)
  async findCourseByTeacher(@Query() query: PaginationQueryDto, @ReqUser() user: User) {
    return await this.courseService.findCoursesByTeacher({ user, query })
  }

  @Patch('update/:id')
  @Roles(RoleEnum.TEACHER)
  @UseInterceptors(CourseImageInterceptor('image'))
  @ResponseMessage('Chỉnh sửa thành công')
  async update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @ReqUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const course = await this.courseService.update({
      id,
      user,
      updateCourseDto: { ...updateCourseDto, image: file?.filename },
    })

    return { course }
  }

  @Delete('delete/:id')
  @Roles(RoleEnum.TEACHER)
  async delete(@Param('id', ParseIdPipe) id: number, @ReqUser() user: User) {
    return await this.courseService.delete({ id, user })
  }

  @Post('enroll-course/:courseId')
  @Roles(RoleEnum.STUDENT)
  @ResponseMessage('Người dùng tham gia thành công')
  async enrollCourse(@ReqUser() user: User, @Param('courseId', ParseIdPipe) courseid: string) {
    return this.courseService.enrollCourse(user, +courseid)
  }
}
