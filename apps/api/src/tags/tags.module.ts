import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  controllers: [TagsController], // ← expose les routes
  providers: [TagsService], // ← rend le service injectable
})
export class TagsModule {}
// Pas d'exports nécessaire — aucun autre module n'a besoin de TagsService
