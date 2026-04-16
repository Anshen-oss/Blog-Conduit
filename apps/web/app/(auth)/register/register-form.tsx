'use client'

import { registerAction } from '@/actions/auth.actions'
import { useActionState } from 'react'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, {})

  return (
    <form action={formAction}>
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
          type="text"
          name="username"
          placeholder="Your Name"
          required
          disabled={isPending}
        />
      </fieldset>

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
        {isPending ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  )
}
