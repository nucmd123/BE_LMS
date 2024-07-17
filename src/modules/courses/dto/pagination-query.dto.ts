import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export default class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsInt()
  @Min(1)
  page: number

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsInt()
  @Min(1)
  limit: number
}
