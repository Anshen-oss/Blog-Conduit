'use client'

import { loginAction } from '@/actions/auth.actions'
import { useActionState } from 'react'

const inputClass = 'w-full px-4 py-3 text-base border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand disabled:opacity-60'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {})

  return (
    <form action={formAction} className="flex flex-col gap-4">

      {/* Erreurs globales */}
      {state.errors && (
        <ul className="bg-danger-light border border-danger rounded px-4 py-3">
          {Object.entries(state.errors).map(([field, messages]) =>
            messages.map((message) => (
              <li key={`${field}-${message}`} className="text-sm text-danger">
                {field && field !== '' ? `${field} ` : ''}{message}
              </li>
            ))
          )}
        </ul>
      )}

      <input
        className={inputClass}
        type="email"
        name="email"
        placeholder="Email"
        required
        disabled={isPending}
      />

      <input
        className={inputClass}
        type="password"
        name="password"
        placeholder="Password"
        required
        disabled={isPending}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 text-lg font-semibold bg-brand text-white rounded hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

    </form>
  )
}
