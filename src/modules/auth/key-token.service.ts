import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { KeyToken } from './entities/key-token.entity'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'

@Injectable()
export class KeyTokenService {
  constructor(@InjectRepository(KeyToken) private keyTokenRepository: Repository<KeyToken>) {}

  async saveKeyToken(refreshToken: string, user: User) {
    let keyToken: KeyToken
    keyToken = await this.keyTokenRepository.findOne({ where: { user: { id: user.id } } })

    if (keyToken) {
      keyToken.refreshToken = refreshToken
      return await this.keyTokenRepository.save(keyToken)
    }

    keyToken = this.keyTokenRepository.create({ refreshToken, user })
    return await this.keyTokenRepository.save(keyToken)
  }

  async deleteRefreshToken(user: User) {
    const keyToken = await this.keyTokenRepository.findOne({ where: { user: { id: user.id } } })
    if (keyToken.refreshToken) {
      keyToken.refreshToken = null
      return await this.keyTokenRepository.save(keyToken)
    }
    throw new UnauthorizedException('You need signin')
  }

  async findByRefreshToken(refreshToken: string) {
    return await this.keyTokenRepository.findOne({ where: { refreshToken }, relations: { user: { role: true } } })
  }
}
