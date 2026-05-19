'use server'

import { ApiError, login, register } from '@/lib/api'
import type { ConduitUser } from '@/lib/auth'
import { deleteAuthCookie, setAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export type AuthActionResult = {
  errors?: Record<string, string[]>
}

// --- LOGIN ---
export async function loginAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const data = await login(email, password) as { user: ConduitUser }
    await setAuthCookie(data.user.token)
  } catch (error) {
    console.error('LOGIN ERROR:', error)
    if (error instanceof ApiError) {
      return { errors: error.errors }
    }
    return { errors: { '': ['Une erreur inattendue est survenue'] } }
  }

  redirect('/')
}

// --- REGISTER ---
export async function registerAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const data = await register(username, email, password) as { user: ConduitUser }
    await setAuthCookie(data.user.token)
  } catch (error) {
    if (error instanceof ApiError) {
      return { errors: error.errors }
    }
    return { errors: { '': ['Une erreur inattendue est survenue'] } }
  }

  redirect('/')
}

// --- LOGOUT ---
export async function logoutAction(): Promise<void> {
  await deleteAuthCookie()
  redirect('/')
}


export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;

  const res = await fetch(`${process.env.API_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    // On affiche quand même un message de succès (sécurité)
  }

  redirect('/forgot-password/success');
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;

  const res = await fetch(`${process.env.API_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  if (!res.ok) {
    throw new Error('Token invalide ou expiré.');
  }

  redirect('/login?reset=success');
}
