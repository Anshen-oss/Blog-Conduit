import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

// Type de retour enrichi — article + auteur + tags + comptages
const articleInclude = {
  author: {
    select: { username: true, bio: true, image: true },
  },
  tags: {
    include: { tag: { select: { name: true } } },
  },
  favorites: {
    select: { userId: true },
  },
  _count: {
    select: { favorites: true },
  },
} satisfies Prisma.ArticleInclude;

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────
  // Helpers privés
  // ──────────────────────────────────────────────

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const suffix = Math.random().toString(36).slice(2, 7);
    return `${base}-${suffix}`;
  }

  // Formate la réponse article selon la spec RealWorld
  private formatArticle(
    article: Prisma.ArticleGetPayload<{ include: typeof articleInclude }>,
    currentUserId?: string,
  ) {
    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tags.map((t) => t.tag.name),
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited: currentUserId
        ? article.favorites.some((f) => f.userId === currentUserId)
        : false,
      favoritesCount: article._count.favorites,
      author: article.author,
    };
  }

  // ──────────────────────────────────────────────
  // CRUD de base
  // ──────────────────────────────────────────────

  async create(authorId: string, dto: CreateArticleDto) {
    const slug = this.generateSlug(dto.title);

    const article = await this.prisma.article.create({
      data: {
        slug,
        title: dto.title,
        description: dto.description,
        body: dto.body,
        authorId,
        // Créer les tags manquants et créer les liaisons ArticleTag
        tags: dto.tagList
          ? {
              create: dto.tagList.map((name) => ({
                tag: {
                  // connectOrCreate = créer le tag s'il n'existe pas, sinon connecter
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
      },
      include: articleInclude,
    });

    this.logger.log(`Article créé : ${slug}`);
    return this.formatArticle(article, authorId);
  }

  async findBySlug(slug: string, currentUserId?: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: articleInclude,
    });

    if (!article) {
      throw new NotFoundException(`Article "${slug}" introuvable`);
    }

    return this.formatArticle(article, currentUserId);
  }

  async update(slug: string, currentUserId: string, dto: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({ where: { slug } });

    if (!article) {
      throw new NotFoundException(`Article "${slug}" introuvable`);
    }

    // Seul l'auteur peut modifier son article
    if (article.authorId !== currentUserId) {
      throw new ForbiddenException("Seul l'auteur peut modifier cet article");
    }

    const updated = await this.prisma.article.update({
      where: { slug },
      data: {
        // Regénérer le slug uniquement si le titre change
        ...(dto.title && {
          title: dto.title,
          slug: this.generateSlug(dto.title),
        }),
        ...(dto.description && { description: dto.description }),
        ...(dto.body && { body: dto.body }),
      },
      include: articleInclude,
    });

    return this.formatArticle(updated, currentUserId);
  }

  async remove(slug: string, currentUserId: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });

    if (!article) {
      throw new NotFoundException(`Article "${slug}" introuvable`);
    }

    if (article.authorId !== currentUserId) {
      throw new ForbiddenException("Seul l'auteur peut supprimer cet article");
    }

    await this.prisma.article.delete({ where: { slug } });
    this.logger.log(`Article supprimé : ${slug}`);
  }

  // ──────────────────────────────────────────────
  // Liste paginée avec filtres
  // ──────────────────────────────────────────────

  async findAll(
    params: {
      tag?: string;
      author?: string;
      favorited?: string;
      limit: number;
      offset: number;
    },
    currentUserId?: string,
  ) {
    const { tag, author, favorited, limit, offset } = params;

    // Construction dynamique du filtre WHERE
    const where: Prisma.ArticleWhereInput = {
      ...(tag && { tags: { some: { tag: { name: tag } } } }),
      ...(author && { author: { username: author } }),
      ...(favorited && {
        favorites: { some: { user: { username: favorited } } },
      }),
    };

    const [articles, articlesCount] = await Promise.all([
      this.prisma.article.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: articleInclude,
      }),
      // Compter le total (pour la pagination côté frontend)
      this.prisma.article.count({ where }),
    ]);

    return {
      articles: articles.map((a) => this.formatArticle(a, currentUserId)),
      articlesCount,
    };
  }

  // ──────────────────────────────────────────────
  // Feed personnalisé
  // ──────────────────────────────────────────────

  async getFeed(currentUserId: string, limit: number, offset: number) {
    // Récupérer les IDs des utilisateurs suivis
    const follows = await this.prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });

    const followingIds = follows.map((f) => f.followingId);

    const [articles, articlesCount] = await Promise.all([
      this.prisma.article.findMany({
        where: { authorId: { in: followingIds } },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: articleInclude,
      }),
      this.prisma.article.count({
        where: { authorId: { in: followingIds } },
      }),
    ]);

    return {
      articles: articles.map((a) => this.formatArticle(a, currentUserId)),
      articlesCount,
    };
  }

  // ──────────────────────────────────────────────
  // Favoris
  // ──────────────────────────────────────────────

  async favorite(slug: string, currentUserId: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });

    if (!article) {
      throw new NotFoundException(`Article "${slug}" introuvable`);
    }

    // upsert = créer si absent, ignorer si déjà présent
    await this.prisma.favorite.upsert({
      where: {
        userId_articleId: { userId: currentUserId, articleId: article.id },
      },
      create: { userId: currentUserId, articleId: article.id },
      update: {},
    });

    return this.findBySlug(slug, currentUserId);
  }

  async unfavorite(slug: string, currentUserId: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });

    if (!article) {
      throw new NotFoundException(`Article "${slug}" introuvable`);
    }

    await this.prisma.favorite.deleteMany({
      where: { userId: currentUserId, articleId: article.id },
    });

    return this.findBySlug(slug, currentUserId);
  }
}
