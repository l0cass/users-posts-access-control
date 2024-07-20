import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { Role } from 'src/enums/role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requiredRoles) return true;

    const { user } = request;
    return requiredRoles.filter((role) => role === user.role).length > 0;
  }
}
