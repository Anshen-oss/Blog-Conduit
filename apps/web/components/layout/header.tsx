// Header de Conduit — navigation principale
// Server Component (pas de 'use client' nécessaire ici)

import { getCurrentUser } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';

import type { User } from '@/types';
import Link from 'next/link';

export async function Header() {
  // On récupère l'utilisateur courant côté serveur pour afficher
  // les bons liens (connecté vs déconnecté)
  const token = await getAuthToken();
  let user: User | null = null;

  if (token) {
    try {
      // L'API renvoie { user: {...} } selon la spec Conduit
      const data = await getCurrentUser(token) as { user: User };
      user = data.user;
    } catch {
      // Token expiré ou invalide — on traite l'utilisateur comme déconnecté
      user = null;
    }
  }

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        {/* Logo Conduit — lien vers l'accueil */}
        <Link className="navbar-brand" href="/">
          Blog Anshen
        </Link>

        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className="nav-link" href="/">
              Home
            </Link>
          </li>

          {user ? (
            // Navigation connectée
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/editor">
                  <i className="ion-compose" />
                  &nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/settings">
                  <i className="ion-gear-a" />
                  &nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={`/profile/${user.username}`}>
                  {user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      className="user-pic"
                      alt={user.username}
                    />
                  )}
                  {user.username}
                </Link>
              </li>
            </>
          ) : (
            // Navigation déconnectée
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/login">
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/register">
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
