// Type représentant l'utilisateur attaché sur req.user par JwtStrategy
// Utilisé dans tous les controllers via @CurrentUser()
export interface AuthUser {
  id: string;
  email: string;
  username: string;
}
