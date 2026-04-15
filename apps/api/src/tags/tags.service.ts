import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  // Logger NestJS — jamais console.log
  private readonly logger = new Logger(TagsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<string[]> {
    this.logger.log('Récupération de tous les tags');

    // On récupère tous les tags, triés alphabétiquement
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      // On ne sélectionne que le champ "name" — pas besoin de l'id
      select: { name: true },
    });

    // On transforme [{ name: 'nestjs' }, { name: 'react' }] en ['nestjs', 'react']
    return tags.map((t) => t.name);
  }
}
