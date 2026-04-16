import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { LogoutButton } from './logout-button'

export async function Navbar() {
  // Server Component — peut être async et lire les cookies
  const user = await getCurrentUser()

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" href="/">
          conduit
        </Link>

        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className="nav-link" href="/">Home</Link>
          </li>

          {user ? (
            // Utilisateur connecté
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/editor">
                  <i className="ion-compose"></i>&nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/settings">
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href={`/profile/${user.username}`}
                >
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.username}
                      className="user-pic"
                    />
                  )}
                  {user.username}
                </Link>
              </li>
              <li className="nav-item">
                {/* Client Component pour le bouton logout */}
                <LogoutButton />
              </li>
            </>
          ) : (
            // Visiteur non connecté
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/login">Sign in</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/register">Sign up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
