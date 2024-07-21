import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class CreateCourseDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsOptional()
  @IsString()
  image?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date
}
