import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from './profiles.service';

const mockPrisma = {
  user: { findUnique: jest.fn() },
  follow: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    deleteMany: jest.fn(),
  },
};

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it("doit lever NotFoundException si le profil n'existe pas", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('nobody')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('doit retourner following: false si non connecté', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-2',
        username: 'alice',
        bio: null,
        image: null,
      });

      // Pas de currentUserId fourni → non connecté
      const result = await service.getProfile('alice');
      expect(result.following).toBe(false);
    });

    it('doit retourner following: true si on suit ce profil', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-2',
        username: 'alice',
        bio: null,
        image: null,
      });
      // Simuler que l'enregistrement Follow existe
      mockPrisma.follow.findUnique.mockResolvedValue({
        followerId: 'user-1',
        followingId: 'user-2',
      });

      const result = await service.getProfile('alice', 'user-1');
      expect(result.following).toBe(true);
    });
  });
});
