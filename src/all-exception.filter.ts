import { HttpAdapterHost } from '@nestjs/core'
import { getReasonPhrase } from 'http-status-codes'
import { ValidationError as ClassValidationError } from 'class-validator'
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private formatValidationErrors(exception: ClassValidationError[]) {
    return exception.map((err: ClassValidationError) => ({
      field: err.property,
      error: Object.values(err.constraints).join(', '),
    }))
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    console.log(exception)
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    // const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR
    let message: any = getReasonPhrase(httpStatus)

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
      message = exception.message || 'HTTP exception'
      // message = (exception.getResponse() as string) || 'HTTP exception'
    } else if (exception instanceof Array && exception[0] instanceof ClassValidationError) {
      httpStatus = HttpStatus.BAD_REQUEST
      message = this.formatValidationErrors(exception)
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    }

    const responseBody = {
      status: getReasonPhrase(httpStatus),
      statusCode: httpStatus,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      method: request.method,
      message,
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
