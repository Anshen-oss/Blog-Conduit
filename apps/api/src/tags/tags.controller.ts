import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags') // → /api/tags
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // GET /api/tags — route publique, aucun guard
  @Get()
  async findAll() {
    const tags = await this.tagsService.findAll();
    // Spec Conduit : { "tags": ["dragon", "training"] }
    return { tags };
  }
}
