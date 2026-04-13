import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // On surcharge canActivate pour ne jamais rejeter la requête
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // On appelle le guard JWT parent — mais on ignore l'erreur
    return super.canActivate(context);
  }

  // handleRequest est appelé après la validation du token
  // Si pas de token ou token invalide → user = null (pas d'erreur levée)
  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    return user; // null si non authentifié — pas d'exception
  }
}
