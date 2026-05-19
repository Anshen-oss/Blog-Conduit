import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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
  private readonly logger = new Logger(AuthService.name); // 👈 ajouter

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
      token, // inclus dans la réponse ET dans le cookie
    };
  }

  async forgotPassword(email: string): Promise<void> {
    // 1. Chercher l'utilisateur (sans révéler s'il existe ou non)
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Sécurité : on ne dit JAMAIS si l'email existe
      this.logger.log(`Reset demandé pour email inconnu : ${email}`);
      return;
    }

    // 2. Générer le token brut (64 caractères hex)
    const rawToken = crypto.randomBytes(32).toString('hex');

    // 3. Hasher le token avant de le stocker
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // 4. Stocker le hash + expiration (1 heure)
    await this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    // 5. Construire l'URL de reset avec le token BRUT
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    // 6. Envoyer l'email
    await this.mailService.sendPasswordReset(email, resetUrl);
    this.logger.log(`Token de reset généré pour ${email}`);
  }

  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    // 1. Hasher le token reçu pour le comparer à celui en base
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // 2. Chercher l'utilisateur avec ce token et vérifier l'expiration
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() }, // gt = greater than = pas encore expiré
      },
    });

    if (!user) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    // 3. Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Mettre à jour le mot de passe ET invalider le token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null, // Token invalidé
        resetPasswordExpires: null, // Date invalidée
      },
    });

    this.logger.log(`Mot de passe réinitialisé pour userId: ${user.id}`);
  }
}
