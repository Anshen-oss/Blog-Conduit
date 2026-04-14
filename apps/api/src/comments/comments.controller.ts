import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

// Toutes les routes de ce controller commencent par articles/:slug/comments
@Controller('articles/:slug/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /api/articles/:slug/comments — public
  @Get()
  findAll(@Param('slug') slug: string) {
    return this.commentsService.findAllBySlug(slug);
  }

  // POST /api/articles/:slug/comments — auth requise
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('slug') slug: string,
    @Body('comment') dto: CreateCommentDto, // La spec Conduit enveloppe dans { "comment": {...} }
    @Request() req: { user: { id: string } },
  ) {
    return this.commentsService.create(slug, dto, req.user.id);
  }

  // DELETE /api/articles/:slug/comments/:id — auth requise
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT) // 204 — succès sans body de réponse
  remove(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.commentsService.remove(id, req.user.id);
  }
}
