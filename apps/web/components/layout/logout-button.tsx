'use client'

import { logoutAction } from '@/actions/auth.actions'

export function LogoutButton() {
  return (
    <button
      className="nav-link"
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      onClick={() => logoutAction()}
    >
      Sign out
    </button>
  )
}
