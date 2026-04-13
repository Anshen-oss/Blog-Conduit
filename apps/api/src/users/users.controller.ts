import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

import { AuthUser } from '../common/types/auth-user.type';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getCurrentUser(@CurrentUser() user: AuthUser) {
    const safeUser = await this.usersService.getCurrentUser(user.id);
    return { user: safeUser };
  }

  @Put()
  async updateUser(
    @CurrentUser() user: AuthUser,
    @Body('user') dto: UpdateUserDto,
  ) {
    const safeUser = await this.usersService.updateUser(user.id, dto);
    return { user: safeUser };
  }
}
