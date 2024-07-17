import { PartialType } from '@nestjs/swagger'
import { CreateCourseDto } from './create-course.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsOptional()
  @IsString()
  image?: string

  //   @IsOptional()
  //   @IsDate()
  //   startDate?: Date
}
