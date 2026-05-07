import Link from 'next/link';

interface HeaderProps {
  username?: string | null // null = non connecté
}

export function Header({ username }: HeaderProps) {
  return (
    <nav className="border-b border-conduit-border bg-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-brand font-bold text-xl tracking-tight hover:text-brand-hover transition-colors"
        >
          conduit
        </Link>

        {/* Navigation */}
        <ul className="flex items-center gap-1">
          <NavLink href="/">Home</NavLink>

          {username ? (
            <>
              <NavLink href="/editor">✏️ New Article</NavLink>
              <NavLink href="/settings">⚙️ Settings</NavLink>
              <NavLink href={`/profile/${username}`}>{username}</NavLink>
            </>
          ) : (
            <>
              <NavLink href="/login">Sign in</NavLink>
              <NavLink href="/register">Sign up</NavLink>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

// Sous-composant NavLink — réutilisable dans ce fichier
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="px-3 py-2 text-sm text-conduit-gray hover:text-conduit-text rounded transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}
