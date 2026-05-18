// Header de Conduit — navigation principale
// Server Component (pas de 'use client' nécessaire ici)

import { getCurrentUser } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { LogoutButton } from './logout-button';

import type { User } from '@/types';
import Link from 'next/link';

export async function Header() {
  const token = await getAuthToken();
  let user: User | null = null;

  if (token) {
    try {
      const data = await getCurrentUser(token) as { user: User }
      user = data.user
    } catch {
      user = null
    }
  }

  return (
    <nav className="border-b border-conduit-border bg-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link className="text-brand font-bold text-xl tracking-tight hover:text-brand-hover transition-colors" href="/">
          Blog Anshen
        </Link>

        <ul className="flex items-center gap-1">
          <li>
            <Link className="px-3 py-2 text-sm text-conduit-gray hover:text-conduit-text transition-colors" href="/">
              Home
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link className="px-3 py-2 text-sm text-conduit-gray hover:text-conduit-text transition-colors" href="/editor">
                  <i className="ion-compose" />
                  &nbsp;New Article
                </Link>
              </li>
              <li>
                <Link className="px-3 py-2 text-sm text-conduit-gray hover:text-conduit-text transition-colors" href="/settings">
                  <i className="ion-gear-a" />
                  &nbsp;Settings
                </Link>
              </li>
              <li>
                <Link className="px-3 py-2 text-sm text-conduit-gray hover:text-conduit-text transition-colors flex items-center gap-2" href={`/profile/${user.username}`}>
                  {user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      className="w-6 h-6 rounded-full object-cover"
                      alt={user.username}
                    />
                  )}
                  {user.username}
                </Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="px-3 py-2 text-sm text-conduit-gray hover:text-conduit-text transition-colors" href="/login">
                  Sign in
                </Link>
              </li>
              <li>
                <Link className="px-3 py-2 text-sm text-conduit-gray hover:text-conduit-text transition-colors" href="/register">
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
