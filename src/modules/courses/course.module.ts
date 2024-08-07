import { Module } from '@nestjs/common'
import { CourseService } from './course.service'
import { CourseController } from './course.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Course } from './entities/course.entity'
import { Enrollment } from './entities/enrollment.entity'

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [TypeOrmModule.forFeature([Course, Enrollment])],
  exports: [CourseService],
})
export class CourseModule {}
