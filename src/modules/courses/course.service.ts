import { Injectable } from '@nestjs/common'
import { CreateCourseDto } from './dto/create-course.dto'
import { UpdateCourseDto } from './dto/update-course.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from './entities/course.entity'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'

@Injectable()
export class CourseService {
  constructor(@InjectRepository(Course) private courseRepository: Repository<Course>) {}

  async create({ createCourseDto, user }: { createCourseDto: CreateCourseDto; user: User }): Promise<Course> {
    const _course = this.courseRepository.create({ ...createCourseDto, teacherId: user.id, teacher: user })
    return await this.courseRepository.save(_course)
    // return 'This action adds a new course'
  }

  findAll() {
    return `This action returns all course`
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
