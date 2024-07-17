import { Injectable } from '@nestjs/common'
import { CreateCourseDto } from './dto/create-course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from './entities/course.entity'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import PaginationQueryDto from './dto/pagination-query.dto'

type ICreateCourse = { createCourseDto: CreateCourseDto; user: User }
type IFindAllCourse = { query: PaginationQueryDto }

@Injectable()
export class CourseService {
  constructor(@InjectRepository(Course) private courseRepository: Repository<Course>) {}

  async create({ createCourseDto, user }: ICreateCourse): Promise<Course> {
    const _course = this.courseRepository.create({ ...createCourseDto, teacherId: user.id, teacher: user })
    return await this.courseRepository.save(_course)
  }

  async findAll({ query }: IFindAllCourse) {
    const page = query.page || 1 // số trang
    const limit = query.limit || 10 // số item 1 trang

    // return `This action returns all course`
    const [courses, total] = await this.courseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })
    return {
      meta: {
        totalItems: total, // Tổng số bản ghi trong cơ sở dữ liệu
        itemCount: courses.length, // Số lượng bản ghi trong trang hiện tại
        itemsPerPage: limit, // Số lượng bản ghi trên mỗi trang
        totalPages: Math.ceil(total / limit), // tổng số trang
        currentPage: page, // trang hiện tại
      },
      courses,
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} course`
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`
  }

  remove(id: number) {
    return `This action removes a #${id} course`
  }
}
