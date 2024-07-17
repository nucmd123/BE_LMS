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

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('create')
  @Roles(RoleEnum.TEACHER)
  @UseInterceptors(CourseImageInterceptor('image'))
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @ReqUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      course: await this.courseService.create({
        createCourseDto: {
          ...createCourseDto,
          image: file?.filename,
        },
        user,
      }),
    }
  }

  @Get('find')
  @Public()
  async find(@Query() query: PaginationQueryDto) {
    return {
      ...(await this.courseService.find({ query })),
    }
  }

  @Get('find-one/:id')
  @Public()
  async findOne(@Param('id', ParseIdPipe) id: number) {
    return { ...(await this.courseService.findOne({ id })) }
  }

  @Get('find-course-by-teacher')
  async findCourseByTeacher(@Query() query: PaginationQueryDto, @ReqUser() user: User) {
    return await this.courseService.findCourseByTeacher({ user, query })
  }

  @Patch('update/:id')
  @Roles(RoleEnum.TEACHER)
  @UseInterceptors(CourseImageInterceptor('image'))
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
}
