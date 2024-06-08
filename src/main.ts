import helmet from 'helmet'
import * as morgan from 'morgan'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './all-exception.filter'
import { ValidationError as ClassValidationError } from 'class-validator'
import { TransformInterceptor } from './core/transform.interceptor'
import { join } from 'path'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RolesGuard } from './modules/roles/guards/roles.guard'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const URL_GLOBAL_PREFIX = 'api'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get(ConfigService)
  const reflector = app.get(Reflector)
  const PORT = configService.get('PORT')
  const originCors: string = configService.get('CLIENT_URL')

  app.use(helmet())
  app.use(morgan('dev'))

  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector))
  app.useGlobalInterceptors(new TransformInterceptor(reflector))
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ClassValidationError[] = []) => {
        return validationErrors
      },
    }),
  )

  // cors config
  app.enableCors({ credentials: true, origin: originCors })

  // versioning config
  // /api/v[1,2,3,...]/...
  app.setGlobalPrefix(URL_GLOBAL_PREFIX) // api
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  // static assets config
  app.useStaticAssets(join(__dirname, '../public'), { prefix: '/public' })

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('LMS Api Document')
    .setDescription('LMS Api Document description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'JWT', in: 'header' }, 'authorization')
    .addSecurityRequirements('authorization')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document, { swaggerOptions: { persistAuthorization: true } })

  // app listen
  await app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
  })
}

bootstrap()
