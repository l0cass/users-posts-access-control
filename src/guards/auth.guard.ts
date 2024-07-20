import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization)
      throw new UnauthorizedException('Authorization is missing');

    const accessToken = authorization.split('Bearer ')[1];

    if (!accessToken)
      throw new UnauthorizedException('Access token is missing');

    request.user = await this.authService.checkToken(accessToken);
    return true;
  }
}
