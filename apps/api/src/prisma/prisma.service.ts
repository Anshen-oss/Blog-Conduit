import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
// PrismaClient contient toutes les méthodes : prisma.user, prisma.article, etc.
// OnModuleInit : NestJS appelle onModuleInit() automatiquement au démarrage
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    // Ouvre la connexion à PostgreSQL au démarrage de l'application

    await this.$connect();
  }
  // NestJS gère la fermeture propre via enableShutdownHooks() dans main.ts
  // Pas besoin de gérer onModuleDestroy manuellement avec les versions récentes
}
