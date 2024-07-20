import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './posts/post.module';

@Module({ imports: [UserModule, PostModule, AuthModule] })
export class AppModule {}
