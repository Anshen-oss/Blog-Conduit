import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;

  // Mock de PrismaService — on ne touche pas à la vraie base de données
  const mockPrismaService = {
    tag: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  // Réinitialiser les mocks entre chaque test
  afterEach(() => jest.clearAllMocks());

  // ──────────────────────────────────────────────
  // findAll
  // ──────────────────────────────────────────────

  describe('findAll', () => {
    it('doit retourner un tableau de noms de tags', async () => {
      // ARRANGE — Prisma retourne des objets { name: string }
      mockPrismaService.tag.findMany.mockResolvedValue([
        { name: 'javascript' },
        { name: 'nestjs' },
        { name: 'react' },
      ]);

      // ACT
      const result = await service.findAll();

      // ASSERT — on attend un tableau de strings, pas d'objets
      expect(result).toEqual(['javascript', 'nestjs', 'react']);
    });

    it("doit retourner un tableau vide si aucun tag n'existe", async () => {
      // ARRANGE
      mockPrismaService.tag.findMany.mockResolvedValue([]);

      // ACT
      const result = await service.findAll();

      // ASSERT
      expect(result).toEqual([]);
    });

    it('doit appeler prisma.tag.findMany avec orderBy alphabétique', async () => {
      // ARRANGE
      mockPrismaService.tag.findMany.mockResolvedValue([]);

      // ACT
      await service.findAll();

      // ASSERT — vérifie que le tri alphabétique est bien demandé
      expect(mockPrismaService.tag.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        select: { name: true },
      });
    });
  });
});
