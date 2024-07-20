import {
  Get,
  Param,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { PostService } from 'src/posts/post.service';

import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.getById(userId);
  }

  @Get('posts/:id')
  async getByUserId(@Param('id', ParseUUIDPipe) userId: string) {
    return this.postService.getByUserId(userId);
  }

  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
