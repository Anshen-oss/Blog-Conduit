// Helpers pour lire/supprimer le JWT dans les Server Components
// ⚠️ Ce fichier ne peut être utilisé QUE dans les Server Components (cookies() est côté serveur)

import { cookies } from 'next/headers';

const TOKEN_KEY = 'token';

// Récupère le JWT depuis le cookie httpOnly — retourne null si absent
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value ?? null;
}

// Vérifie si l'utilisateur est connecté (présence du cookie)
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}
