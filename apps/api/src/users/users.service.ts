import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

type SafeUser = {
  id: string;
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Type explicite pour le payload — pas d'import Prisma nécessaire
type UserUpdateData = {
  email?: string;
  username?: string;
  password?: string;
  bio?: string;
  image?: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // password absent du select → jamais retourné
      },
    });
    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<SafeUser> {
    const data: UserUpdateData = { ...dto };

    if (dto.password !== undefined && dto.password !== '') {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.email || dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                dto.email ? { email: dto.email } : {},
                dto.username ? { username: dto.username } : {},
              ],
            },
          ],
        },
      });
      if (existing) {
        throw new ConflictException('Email ou username déjà utilisé');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // password absent du select → jamais retourné
      },
    });

    return updated;
  }
}
