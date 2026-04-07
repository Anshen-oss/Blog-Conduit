import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ← disponible dans toute l'app sans imports répétés
@Module({
  providers: [PrismaService], // ← NestJS crée une instance unique (singleton)
  exports: [PrismaService], // ← les autres modules peuvent l'injecter
})
export class PrismaModule {}
