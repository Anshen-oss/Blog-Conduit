import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // ─── Routes publiques (mais JWT optionnel pour savoir si favori) ───

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Query('tag') tag?: string,
    @Query('author') author?: string,
    @Query('favorited') favorited?: string,
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
    @CurrentUser() currentUser?: AuthUser,
  ) {
    return this.articlesService.findAll(
      {
        tag,
        author,
        favorited,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
      currentUser?.id,
    );
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard) // feed = auth obligatoire
  async getFeed(
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.articlesService.getFeed(
      currentUser.id,
      parseInt(limit, 10),
      parseInt(offset, 10),
    );
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('slug') slug: string,
    @CurrentUser() currentUser?: AuthUser,
  ) {
    const article = await this.articlesService.findBySlug(
      slug,
      currentUser?.id,
    );
    return { article };
  }

  // ─── Routes protégées ───

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body('article') dto: CreateArticleDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    const article = await this.articlesService.create(currentUser.id, dto);
    return { article };
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('slug') slug: string,
    @Body('article') dto: UpdateArticleDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    const article = await this.articlesService.update(
      slug,
      currentUser.id,
      dto,
    );
    return { article };
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT) // 204 — suppression réussie sans corps de réponse
  async remove(
    @Param('slug') slug: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    await this.articlesService.remove(slug, currentUser.id);
  }

  // ─── Favoris ───

  @Post(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  async favorite(
    @Param('slug') slug: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    const article = await this.articlesService.favorite(slug, currentUser.id);
    return { article };
  }

  @Delete(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  async unfavorite(
    @Param('slug') slug: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    const article = await this.articlesService.unfavorite(slug, currentUser.id);
    return { article };
  }
}
