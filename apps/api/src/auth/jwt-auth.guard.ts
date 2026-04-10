import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Ce guard déclenche la JwtStrategy (nommée 'jwt' par convention Passport)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
