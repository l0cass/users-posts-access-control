import {
  HttpStatus,
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';
import { CreatePost } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId, deletedAt: null },
        select: {
          posts: {
            where: { deletedAt: null },
            select: {
              id: true,
              title: true,
              content: true,
              authorId: true,
            },
          },
        },
      });

      if (!user) throw new NotFoundException(`User not found`);

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async create(userId: string, post: CreatePost) {
    try {
      await this.prisma.post.create({
        data: {
          ...post,
          id: randomUUID(),
          author: { connect: { id: userId } },
        },
      });

      return {
        message: `Post has been successfully created.`,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Post already exists');

      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Error creating post');
    }
  }

  async delete(postId: string) {
    try {
      const post = await this.prisma.post.update({
        where: { id: postId },
        data: { deletedAt: new Date().toISOString() },
      });

      if (!post) throw new NotFoundException(`Post not found`);

      return {
        message: `Post has been successfully deleted.`,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
