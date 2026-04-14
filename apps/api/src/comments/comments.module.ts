import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  // Pas besoin d'importer PrismaModule — il est @Global()
})
export class CommentsModule {}
