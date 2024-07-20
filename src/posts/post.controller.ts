import {
  Get,
  Req,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePost } from './dto/create-post.dto';

import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';

export interface AuthenticatedRequest extends Request {
  user?: { sub: string };
}

@Controller('posts')
@Roles(Role.User, Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPosts(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;
    return this.postService.getByUserId(userId);
  }

  @Post()
  async create(@Body() post: CreatePost, @Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;
    return this.postService.create(userId, post);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) postId: string) {
    return this.postService.delete(postId);
  }
}
