import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { AccessUser } from 'src/user/dto/access-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

interface GenerateAccessTokenProps {
  id: string;
  role: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async userAccess(user: AccessUser) {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email: user.email, deletedAt: null },
      });

      if (!foundUser)
        throw new NotFoundException('Email or password is not valid');

      const isMatch = await bcrypt.compare(user.password, foundUser.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      return this.generateAccessToken({
        id: foundUser.id,
        role: foundUser.role,
        name: foundUser.name,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Error verifying user login');
    }
  }

  async checkToken(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken);
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException('Invalid or expired token');

      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Token verification failed');
    }
  }

  async generateAccessToken({ id, role, name }: GenerateAccessTokenProps) {
    try {
      return {
        accessToken: this.jwtService.sign({
          sub: id,
          name,
          role,
          expiresIn: '7d',
          audience: 'users',
          issuer: 'auth/login',
        }),
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Error generating JWT token');
    }
  }
}
