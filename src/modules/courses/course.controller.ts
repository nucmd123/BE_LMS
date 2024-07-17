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
import { query } from 'express'
import PaginationQueryDto from './dto/pagination-query.dto'

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('c')
  @Roles(RoleEnum.TEACHER)
  @UseInterceptors(CourseImageInterceptor('image'))
  // -----
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @ReqUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      course: await this.courseService.create({
        createCourseDto: {
          ...createCourseDto,
          image: file.filename,
        },
        user,
      }),
    }
  }

  @Get('fa')
  @Public()
  async findAll(@Query() query: PaginationQueryDto) {
    return {
      ...(await this.courseService.findAll({ query })),
    }
  }

  @Get('r/:id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id)
  }

  @Patch('u/:id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto)
  }

  @Delete('d/:id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id)
  }
}
