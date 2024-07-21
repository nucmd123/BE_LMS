import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCourseDto } from './dto/create-course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from './entities/course.entity'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import PaginationQueryDto from './dto/pagination-query.dto'
import { existsSync, truncate, unlinkSync } from 'fs'
import { COURSE_IMG_DIR } from './course-image.interceptor'
import { Enrollment } from './entities/enrollment.entity'
import paginationMeta from 'src/utils/paginationMeta'

type ICreateCourse = { createCourseDto: CreateCourseDto; user: User }
type IFindCourse = { query: PaginationQueryDto }
type IFindCourseByTeacher = { user: User; query: PaginationQueryDto }
type IFindOneCourse = { id: number }
type IUpdateCourse = { id: number; updateCourseDto: UpdateCourseDto; user: User }
type IDeleteCourse = { id: number; user: User }

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment) private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create({ createCourseDto, user }: ICreateCourse): Promise<Course> {
    const course = this.courseRepository.create({ ...createCourseDto, teacherId: user.id, teacher: user })
    await this.courseRepository.save(course)
    const enrollment = this.enrollmentRepository.create({ user, course })
    await this.enrollmentRepository.save(enrollment)
    return
  }

  async find({ query }: IFindCourse) {
    const page = query.page || 1 // số trang
    const limit = query.limit || 10 // số item 1 trang

    const [courses, total] = await this.courseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['teacher'],
      select: { id: true, title: true, description: true, image: true, teacher: { firstName: true, lastName: true } },
      order: { id: 'DESC' },
    })

    return {
      meta: paginationMeta({ limit, page, total }),
      courses,
    }
  }

  async findCoursesByTeacher({ user, query }: IFindCourseByTeacher) {
    const page = query.page || 1 // số trang
    const limit = query.limit || 10 // số item 1 trang

    const [courses, total] = await this.courseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { teacherId: user.id },
      relations: ['teacher'],
      select: { id: true, title: true, description: true, image: true, teacher: { firstName: true, lastName: true } },
      order: { id: 'DESC' },
    })
    return {
      meta: paginationMeta({ limit, page, total }),
      courses,
    }
  }

  async findOne({ id }: IFindOneCourse) {
    const _course = await this.courseRepository.findOne({
      where: { id },
      relations: { teacher: true },
    })

    const { teacher, ...course } = _course
    return {
      course,
      teacher: {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
      },
    }
  }

  async update({ id, updateCourseDto, user }: IUpdateCourse) {
    const course = await this.courseRepository.findOne({ where: { id } })
    if (!course) throw new NotFoundException('Khoá học không tồn tại')

    // kiểm tra xem giáo viên có sở hữu khoá học không
    if (user.id !== course.teacherId) throw new ForbiddenException('Bạn không có quyền truy cập khoá học này')

    // Xoá image cũ trong server trước khi update thông tin mới cho course
    if (updateCourseDto.image && course.image) {
      const oldCourseImage = `${COURSE_IMG_DIR}/${course.image}`
      if (existsSync(oldCourseImage)) {
        unlinkSync(oldCourseImage)
      }
    }

    Object.assign(course, { ...updateCourseDto, image: updateCourseDto.image ?? course.image })
    return await this.courseRepository.save(course)
  }

  async delete({ id, user }: IDeleteCourse) {
    const course = await this.courseRepository.findOne({ where: { id } })

    if (!course) throw new NotFoundException('Khoá học không tồn tại')

    if (user.id === course.teacherId) return await this.courseRepository.softRemove(course)
    throw new ForbiddenException('Bạn không có quyền truy cập khoá học này')
  }

  async enrollCourse(user: User, courseId: number) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } })
    if (!course) throw new NotFoundException('Khoá học không tồn tại')

    const findEnroll = await this.enrollmentRepository.findOne({
      where: {
        user: { id: user.id },
        course: { id: course.id },
      },
    })

    if (findEnroll) throw new BadRequestException('Người dùng đã tham gia khoá học trước đó')

    const enrollment = this.enrollmentRepository.create({ user, course })

    await this.enrollmentRepository.save(enrollment)
  }

  async findCousesEnrolled(user: User) {
    // const enrolled = await this.courseRepository.manager.findOne(User, {
    //   where: {
    //     id: user.id,
    //   },
    //   relations: { enrollments: true },
    //   select: {
    //     enrollments: {
    //       course: [''],
    //     },
    //   },
    // })

    const enrollments = await this.enrollmentRepository.find({
      where: {
        user: { id: user.id },
      },
      relations: { course: true },
    })

    return { enrollments }
  }
}
