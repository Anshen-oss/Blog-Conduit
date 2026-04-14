import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ArticlesService } from './articles.service';

// Mock complet de PrismaService — on ne touche pas à la vraie BDD
const mockPrisma = {
  article: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  follow: {
    findMany: jest.fn(),
  },
  favorite: {
    upsert: jest.fn(),
    deleteMany: jest.fn(),
  },
};

describe('ArticlesService', () => {
  let service: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);

    // Réinitialiser les mocks entre chaque test
    jest.clearAllMocks();
  });

  // ── Test 1 : création d'article ──
  it('doit créer un article avec un slug généré', async () => {
    const mockArticle = {
      slug: 'hello-world-abc12',
      title: 'Hello World',
      description: 'Test',
      body: 'Contenu',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      favorites: [],
      _count: { favorites: 0 },
      author: { username: 'alice', bio: null, image: null },
    };

    mockPrisma.article.create.mockResolvedValue(mockArticle);

    const result = await service.create('user-id-1', {
      title: 'Hello World',
      description: 'Test',
      body: 'Contenu',
    });

    // Le slug doit exister et contenir le titre transformé
    expect(result.slug).toContain('hello-world');
    expect(mockPrisma.article.create).toHaveBeenCalledTimes(1);
  });

  // ── Test 2 : article introuvable ──
  it("doit lever NotFoundException si l'article n'existe pas", async () => {
    mockPrisma.article.findUnique.mockResolvedValue(null);

    await expect(service.findBySlug('slug-inexistant')).rejects.toThrow(
      NotFoundException,
    );
  });

  // ── Test 3 : modification interdite ──
  it("doit lever ForbiddenException si l'utilisateur n'est pas l'auteur", async () => {
    mockPrisma.article.findUnique.mockResolvedValue({
      id: 'article-id',
      slug: 'mon-article',
      authorId: 'auteur-id', // ← auteur réel
    });

    // 'autre-user' essaie de modifier l'article de 'auteur-id'
    await expect(
      service.update('mon-article', 'autre-user', { title: 'Nouveau titre' }),
    ).rejects.toThrow(ForbiddenException);
  });

  // ── Test 4 : feed vide si aucun abonnement ──
  it("doit retourner un feed vide si l'utilisateur ne suit personne", async () => {
    // Aucun abonnement
    mockPrisma.follow.findMany.mockResolvedValue([]);
    mockPrisma.article.findMany.mockResolvedValue([]);
    mockPrisma.article.count.mockResolvedValue(0);

    const result = await service.getFeed('user-id', 20, 0);

    expect(result.articles).toHaveLength(0);
    expect(result.articlesCount).toBe(0);
  });
});
