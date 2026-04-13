import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // GET /api/profiles/:username — public, mais on lit le JWT si présent
  @Get(':username')
  @UseGuards(OptionalJwtAuthGuard) // guard "optionnel" — expliqué ci-dessous
  async getProfile(
    @Param('username') username: string,
    @CurrentUser() user?: AuthUser,
  ) {
    const profile = await this.profilesService.getProfile(username, user?.id);
    return { profile };
  }

  // POST /api/profiles/:username/follow — auth requise
  @Post(':username/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Param('username') username: string,
    @CurrentUser() user: AuthUser,
  ) {
    const profile = await this.profilesService.followUser(username, user.id);
    return { profile };
  }

  // DELETE /api/profiles/:username/follow — auth requise
  @Delete(':username/follow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Param('username') username: string,
    @CurrentUser() user: AuthUser,
  ) {
    const profile = await this.profilesService.unfollowUser(username, user.id);
    return { profile };
  }
}
