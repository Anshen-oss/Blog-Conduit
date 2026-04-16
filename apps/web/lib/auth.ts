import { cookies } from 'next/headers'
import { ApiError, getCurrentUser as fetchCurrentUser } from './api'

export type ConduitUser = {
  email: string
  username: string
  bio: string | null
  image: string | null
  token: string
}

const COOKIE_NAME = 'conduit_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 jours

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

export async function deleteAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getCurrentUser(): Promise<ConduitUser | null> {
  const token = await getAuthToken()
  if (!token) return null

  try {
    // On utilise la fonction exportée de api.ts — pas apiFetch directement
    const data = await fetchCurrentUser(token) as { user: ConduitUser }
    return data.user
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await deleteAuthCookie()
    }
    return null
  }
}
