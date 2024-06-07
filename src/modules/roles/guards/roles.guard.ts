import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { ReasonPhrases } from 'http-status-codes'
import { ROLES_KEY } from 'src/decorators/roles.decorator'
import { RoleEnum } from 'src/modules/roles/enums/RoleEnum'
import { User } from 'src/modules/users/entities/user.entity'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }
    const request = context.switchToHttp().getRequest<Request>()
    const user = <User>request.user
    const hasRole = requiredRoles.some((role) => user.role?.name === role)

    if (!hasRole) {
      throw new ForbiddenException(`${ReasonPhrases.FORBIDDEN} ${user.role.name} role`)
    }
    return true
  }
}
