import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, typeof value)
    if (Number.isInteger(value)) {
      throw new BadRequestException('Id must be an integer')
    }
    return value
  }
}
