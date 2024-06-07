import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt'

export class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createJwtOptions(): Promise<JwtModuleOptions> {
    return {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: { expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE') },
    }
  }
}
