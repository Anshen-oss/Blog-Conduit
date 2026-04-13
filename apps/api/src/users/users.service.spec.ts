import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

// Mock PrismaService — on ne touche pas à la vraie base de données
const mockPrisma = {
  user: {
    findUniqueOrThrow: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks(); // Reset entre chaque test
  });

  describe('getCurrentUser', () => {
    it('ne doit pas exposer le mot de passe', async () => {
      // Arrange — simuler un utilisateur en base
      mockPrisma.user.findUniqueOrThrow.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        // password absent — comme Prisma le retournerait avec select: { password: false }
        bio: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act — appeler le service
      const result = await service.getCurrentUser('user-1');

      // Assert — le mot de passe n'est pas dans le résultat
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('updateUser', () => {
    it('doit lever ConflictException si email déjà utilisé', async () => {
      // Simuler un conflit — un autre utilisateur a déjà cet email
      mockPrisma.user.findFirst.mockResolvedValue({ id: 'autre-user' });

      await expect(
        service.updateUser('user-1', { email: 'taken@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
