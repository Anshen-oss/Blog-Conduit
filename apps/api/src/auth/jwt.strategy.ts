import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extraire le JWT depuis le cookie httpOnly (pas depuis le header Authorization)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (
            (request?.cookies as Record<string, string> | undefined)?.jwt ??
            null
          );
        },
      ]),
      ignoreExpiration: false, // rejeter les tokens expirés
      secretOrKey: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
    });
  }

  // Appelé automatiquement par Passport si la signature JWT est valide
  // Ce qu'on retourne ici sera disponible dans req.user dans les controllers
  validate(payload: JwtPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
