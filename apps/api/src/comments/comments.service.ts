import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  // Récupère tous les commentaires d'un article via son slug
  async findAllBySlug(slug: string) {
    // On cherche l'article d'abord pour valider qu'il existe
    const article = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Article introuvable');
    }

    // On récupère les commentaires avec les infos de l'auteur
    const comments = await this.prisma.comment.findMany({
      where: { articleId: article.id },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }, // Plus récent en premier
    });

    // On formate la réponse selon la spec Conduit
    return {
      comments: comments.map((c) => ({
        id: c.id,
        body: c.body,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        author: c.author,
      })),
    };
  }

  // Crée un commentaire sur un article
  async create(slug: string, dto: CreateCommentDto, authorId: string) {
    // On vérifie que l'article existe
    const article = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Article introuvable');
    }

    // On crée le commentaire lié à l'article et à l'auteur
    const comment = await this.prisma.comment.create({
      data: {
        body: dto.body,
        articleId: article.id,
        authorId,
      },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            image: true,
          },
        },
      },
    });

    // On retourne le commentaire formaté selon la spec
    return {
      comment: {
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: comment.author,
      },
    };
  }

  // Supprime un commentaire — uniquement par son auteur
  async remove(commentId: string, currentUserId: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    // 404 si le commentaire n'existe pas
    if (!comment) {
      throw new NotFoundException('Commentaire introuvable');
    }

    // 403 si ce n'est pas l'auteur qui tente de supprimer
    if (comment.authorId !== currentUserId) {
      throw new ForbiddenException(
        'Tu ne peux supprimer que tes propres commentaires',
      );
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
  }
}
