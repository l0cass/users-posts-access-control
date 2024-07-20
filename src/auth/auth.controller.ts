import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/user/user.service';

import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';

import { CreateUser } from 'src/user/dto/create-user.dto';
import { AccessUser } from 'src/user/dto/access-user.dto';

import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';

export interface AuthenticatedRequest extends Request {
  user?: { sub: string };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('user/create')
  async create(@Body() user: CreateUser) {
    return this.userService.create(user);
  }

  @Post('user/access')
  async access(@Body() user: AccessUser) {
    return this.authService.userAccess(user);
  }

  @Roles(Role.Admin)
  @Delete('user/delete')
  @UseGuards(AuthGuard, RoleGuard)
  async delete(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;
    return this.userService.delete(userId);
  }
}
