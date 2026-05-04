export const dynamic = 'force-dynamic'
import { ArticleList } from '@/components/articles/article-list'
import { ProfileHeader } from '@/components/profile/profile-header'
import { getArticles, getProfile } from '@/lib/api'
import { getAuthToken, getCurrentUser } from '@/lib/auth'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

// ─── Metadata dynamique ───────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${username} — Conduit`,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { username } = await params
  const { tab = 'my-articles' } = await searchParams

  // On fetch le token (peut être undefined si non connecté)
  const token = await getAuthToken()

  // On fetch le profil — si inexistant, 404
  let profile
  try {
    profile = await getProfile(username, token ?? undefined)
  } catch {
    notFound()
  }

  // On détermine si c'est notre propre profil
  const currentUser = token ? await getCurrentUser() : null
  const isOwnProfile = currentUser?.username === username

  // On fetch les articles selon l'onglet actif
  const { articles } = await getArticles(
    tab === 'favorites'
      ? { favorited: username }
      : { author: username },
  )

  return (
    <>
      {/* En-tête profil */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isAuthenticated={!!token}
      />

      {/* Onglets + articles */}
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">

            {/* Navigation par onglets */}
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a
                    href={`/profile/${username}`}
                    className={`nav-link ${tab === 'my-articles' ? 'active' : ''}`}
                  >
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href={`/profile/${username}?tab=favorites`}
                    className={`nav-link ${tab === 'favorites' ? 'active' : ''}`}
                  >
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            {/* Liste d'articles — réutilise le composant de feature/11 */}
            <ArticleList articles={articles} currentUserToken={token ?? undefined} />

          </div>
        </div>
      </div>
    </>
  )
}
