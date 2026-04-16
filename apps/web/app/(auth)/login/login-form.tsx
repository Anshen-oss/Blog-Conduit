'use client'

import { loginAction } from '@/actions/auth.actions'
import { useActionState } from 'react'

export function LoginForm() {
  // useActionState : gère l'état pending + les erreurs renvoyées par l'action
  const [state, formAction, isPending] = useActionState(loginAction, {})

  return (
    <form action={formAction}>
      {/* Erreurs globales (ex: "email or password is invalid") */}
      {state.errors && (
        <ul className="error-messages">
          {Object.entries(state.errors).map(([field, messages]) =>
            messages.map((message) => (
              <li key={`${field}-${message}`}>
                {field && field !== '' ? `${field} ` : ''}{message}
              </li>
            ))
          )}
        </ul>
      )}

      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="email"
          name="email"
          placeholder="Email"
          required
          disabled={isPending}
        />
      </fieldset>

      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
          type="password"
          name="password"
          placeholder="Password"
          required
          disabled={isPending}
        />
      </fieldset>

      <button
        className="btn btn-lg btn-primary pull-xs-right"
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
