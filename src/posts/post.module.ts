import { PostService } from './post.service';
import { AuthModule } from 'src/auth/auth.module';
import { PostController } from './post.controller';
import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  exports: [PostModule, PostService],
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
