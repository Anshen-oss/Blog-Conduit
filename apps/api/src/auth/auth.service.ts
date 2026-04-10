import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Type retourné par les méthodes — sans le champ password
interface UserResponse {
  id: string;
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<UserResponse> {
    // Vérifier si l'email ou le username existe déjà
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existing) {
      throw new ConflictException('Email ou username déjà utilisé');
    }

    // Hasher le mot de passe — on ne stocke JAMAIS le mot de passe en clair
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Créer l'utilisateur en base
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
      },
    });

    return this.buildUserResponse(user);
  }

  async login(dto: LoginDto): Promise<UserResponse> {
    // Trouver l'utilisateur par email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // On ne dit pas "email introuvable" — ça confirmerait que l'email existe
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Comparer le mot de passe fourni avec le hash stocké
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.buildUserResponse(user);
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    return this.buildUserResponse(user);
  }

  // Méthode privée — factoriser la construction de la réponse utilisateur
  private buildUserResponse(user: {
    id: string;
    email: string;
    username: string;
    bio: string | null;
    image: string | null;
  }): UserResponse {
    // Signer le JWT avec le payload minimal
    const token = this.jwtService.sign({ sub: user.id, username: user.username });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
      token, // inclus dans la réponse ET dans le cookie
    };
  }
}
