import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Response } from 'express'
import { getReasonPhrase } from 'http-status-codes'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { RESPONSE_MESSAGE } from 'src/decorators/response-message.decorator'

export interface IApiResponse<T> {
  status: 'success'
  statusCode: number
  message: string
  metadata: T | null
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse<Response>().statusCode
        return {
          status: 'success',
          statusCode,
          message: this.reflector.get(RESPONSE_MESSAGE, context.getHandler()) || getReasonPhrase(statusCode),
          metadata: data,
        }
      }),
    )
  }
}
