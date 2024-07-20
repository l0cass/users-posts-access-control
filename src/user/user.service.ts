import {
  HttpStatus,
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { CreateUser } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    try {
      const users = await this.prisma.user.findMany({
        where: { deletedAt: null },
        select: { id: true, email: true, name: true },
      });

      if (users.length === 0)
        throw new NotFoundException('No users in database');

      return users;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getById(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
        select: { id: true, email: true, name: true },
      });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async create(user: CreateUser) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      await this.prisma.user.create({
        data: {
          id: randomUUID(),
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      });

      return {
        message: `User has been successfully created.`,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Email already in use');

      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user)
        throw new NotFoundException(`User with ID ${userId} not found`);

      await this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date().toISOString() },
      });

      return {
        message: `User has been successfully deleted.`,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
