'use client'

import { registerAction } from '@/actions/auth.actions'
import { useActionState } from 'react'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, {})

  return (
    <form action={formAction} className="space-y-4">
      {state.errors && (
        <ul className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm space-y-1">
          {Object.entries(state.errors).map(([field, messages]) =>
            messages.map((message) => (
              <li key={`${field}-${message}`}>
                {field && field !== '' ? `${field} ` : ''}{message}
              </li>
            ))
          )}
        </ul>
      )}

      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        type="text"
        name="username"
        placeholder="Your Name"
        required
        disabled={isPending}
      />

      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        type="email"
        name="email"
        placeholder="Email"
        required
        disabled={isPending}
      />

      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        type="password"
        name="password"
        placeholder="Password"
        required
        disabled={isPending}
      />

      <button
        className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  )
}
