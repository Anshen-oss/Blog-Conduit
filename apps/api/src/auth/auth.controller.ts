import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/users — Inscription
  @Post('users')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.register(dto);
    this.setJwtCookie(response, user.token);
    return { user };
  }

  // POST /api/users/login — Connexion
  @Post('users/login')
  @HttpCode(HttpStatus.OK) // Par défaut POST retourne 201, on force 200
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(dto);
    this.setJwtCookie(response, user.token);
    return { user };
  }

  // GET /api/user — Utilisateur courant (auth requise)
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getMe(@Req() request: Request) {
    const userId = (request.user as { id: string }).id;
    const user = await this.authService.getMe(userId);
    return { user };
  }

  // POST /api/users/logout — Déconnexion (efface le cookie)
  @Post('users/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Déconnecté avec succès' };
  }

  // Helper privé — factoriser l'écriture du cookie
  private setJwtCookie(response: Response, token: string): void {
    response.cookie('jwt', token, {
      httpOnly: true, // inaccessible au JavaScript côté client
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
    });
  }
}
