import { UserService } from './user.service';
import { UserController } from './user.controller';
import { forwardRef, Module } from '@nestjs/common';

import { PostModule } from 'src/posts/post.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  exports: [UserModule, UserService],
  imports: [
    PrismaModule,
    forwardRef(() => PostModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
