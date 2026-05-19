import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

jest.mock('../mail/mail.service');

// On mock PrismaService pour ne pas toucher à la vraie base de données
const mockPrismaService = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

// On mock JwtService pour contrôler les tokens dans les tests
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
};

const mockMailService = {
  sendPasswordReset: jest.fn().mockResolvedValue(undefined), // 👈 ajouter
};

describe('AuthService', () => {
  let mailService: jest.Mocked<MailService>;
  let service: AuthService; // 👈 déjà ajouté
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mailService = module.get<MailService>(MailService);
    prisma = module.get(PrismaService);

    // Réinitialiser tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  // ─── Register ───────────────────────────────────────────────

  describe('register', () => {
    it('devrait créer un utilisateur et retourner la réponse sans password', async () => {
      // ARRANGE — simuler qu'aucun utilisateur existant ne correspond
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'cuid-123',
        email: 'test@example.com',
        username: 'testuser',
        bio: null,
        image: null,
        password: 'hashed-password', // en base, il y a toujours le hash
      });

      // ACT — appeler le service
      const result = await service.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });

      // ASSERT — vérifier le résultat
      expect(result.email).toBe('test@example.com');
      expect(result.token).toBe('mocked-jwt-token');
      // Le mot de passe ne doit JAMAIS apparaître dans la réponse
      expect(result).not.toHaveProperty('password');
    });

    it('devrait lever ConflictException si email ou username déjà pris', async () => {
      // ARRANGE — simuler un utilisateur existant
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      });

      // ACT + ASSERT — le service doit lever une exception
      await expect(
        service.register({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── Login ──────────────────────────────────────────────────

  describe('login', () => {
    it('devrait retourner la réponse utilisateur avec token si identifiants valides', async () => {
      // ARRANGE — simuler un utilisateur avec un vrai hash bcrypt
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'cuid-123',
        email: 'test@example.com',
        username: 'testuser',
        bio: null,
        image: null,
        password: hashedPassword,
      });

      // ACT
      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      // ASSERT
      expect(result.email).toBe('test@example.com');
      expect(result.token).toBe('mocked-jwt-token');
      expect(result).not.toHaveProperty('password');
    });

    it('devrait lever UnauthorizedException si email inconnu', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'inconnu@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('devrait lever UnauthorizedException si mot de passe incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'cuid-123',
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        bio: null,
        image: null,
      });

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it("devrait générer un token et appeler mailService si l'email existe", async () => {
      // Arrange
      const mockUser = { id: '1', email: 'test@test.com', username: 'test' };
      prisma.user.findUnique.mockResolvedValue(mockUser as any);
      prisma.user.update.mockResolvedValue(mockUser as any);
      const sendMailSpy = jest
        .spyOn(mailService, 'sendPasswordReset')
        .mockResolvedValue();

      // Act
      await service.forgotPassword('test@test.com');

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'test@test.com' },
          data: expect.objectContaining({
            resetPasswordToken: expect.any(String),
            resetPasswordExpires: expect.any(Date),
          }),
        }),
      );
      expect(sendMailSpy).toHaveBeenCalledTimes(1);
    });

    it("devrait retourner silencieusement si l'email n'existe pas", async () => {
      // Arrange
      prisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert — pas d'erreur thrown
      await expect(
        service.forgotPassword('inconnu@test.com'),
      ).resolves.toBeUndefined();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('devrait hasher le nouveau mot de passe et invalider le token', async () => {
      // Arrange
      const mockUser = { id: '1', email: 'test@test.com' };
      prisma.user.findFirst.mockResolvedValue(mockUser as any);
      prisma.user.update.mockResolvedValue(mockUser as any);

      // Act
      await service.resetPassword('rawtoken123', 'newpassword');

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: expect.objectContaining({
            resetPasswordToken: null,
            resetPasswordExpires: null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            password: expect.any(String), // hashé
          }),
        }),
      );
    });

    it('devrait throw BadRequestException si le token est invalide', async () => {
      // Arrange
      prisma.user.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.resetPassword('invalid-token', 'newpass'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
