import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let prisma: jest.Mocked<PrismaService>;

  // On crée un mock complet de PrismaService
  // Chaque méthode Prisma est remplacée par un jest.fn()
  const mockPrisma = {
    article: {
      findUnique: jest.fn(),
    },
    comment: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prisma = module.get(PrismaService);
  });

  // On réinitialise les mocks avant chaque test pour éviter les interférences
  afterEach(() => jest.clearAllMocks());

  // --- Test : findAllBySlug ---
  describe('findAllBySlug', () => {
    it("devrait lever une NotFoundException si l'article n'existe pas", async () => {
      // On simule un article introuvable
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(service.findAllBySlug('slug-inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("devrait retourner les commentaires si l'article existe", async () => {
      const fakeArticle = { id: 'article-1', slug: 'mon-article' };
      const fakeComments = [
        {
          id: 'comment-1',
          body: 'Super article !',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { username: 'alice', bio: null, image: null },
        },
      ];

      mockPrisma.article.findUnique.mockResolvedValue(fakeArticle);
      mockPrisma.comment.findMany.mockResolvedValue(fakeComments);

      const result = await service.findAllBySlug('mon-article');

      // On vérifie qu'on obtient bien un tableau de commentaires
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].body).toBe('Super article !');
    });
  });

  // --- Test : remove ---
  describe('remove', () => {
    it("devrait lever une NotFoundException si le commentaire n'existe pas", async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);

      await expect(service.remove('id-inexistant', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("devrait lever une ForbiddenException si ce n'est pas l'auteur", async () => {
      // Le commentaire appartient à 'user-2', mais 'user-1' tente de le supprimer
      mockPrisma.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        authorId: 'user-2',
      });

      await expect(service.remove('comment-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("devrait supprimer le commentaire si l'utilisateur est bien l'auteur", async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        authorId: 'user-1',
      });
      mockPrisma.comment.delete.mockResolvedValue({});

      // On vérifie que ça ne lève pas d'exception
      await expect(
        service.remove('comment-1', 'user-1'),
      ).resolves.not.toThrow();

      // On vérifie que Prisma delete a bien été appelé
      expect(mockPrisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
      });
    });
  });
});
