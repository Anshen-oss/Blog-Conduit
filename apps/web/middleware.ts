import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Routes qui nécessitent d'être connecté
const PROTECTED_ROUTES = ['/editor', '/settings']

// Routes accessibles uniquement aux visiteurs (pas connectés)
const AUTH_ROUTES = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('conduit_token')?.value
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // Pas connecté → redirect vers /login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname) // Pour rediriger après login
    return NextResponse.redirect(loginUrl)
  }

  // Déjà connecté → pas besoin d'aller sur /login ou /register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Le middleware ne s'exécute pas sur les fichiers statiques et les routes API Next.js
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
