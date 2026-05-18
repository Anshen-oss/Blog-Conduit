export const dynamic = 'force-dynamic'
import { ArticleList } from '@/components/articles/article-list'
import { ProfileHeader } from '@/components/profile/profile-header'
import { getArticles, getProfile } from '@/lib/api'
import { getAuthToken, getCurrentUser } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  return { title: `${username} — Conduit` }
}

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { username } = await params
  const { tab = 'my-articles' } = await searchParams

  const token = await getAuthToken()

  let profile
  try {
    profile = await getProfile(username, token ?? undefined)
  } catch {
    notFound()
  }

  const currentUser = token ? await getCurrentUser() : null
  const isOwnProfile = currentUser?.username === username

  const { articles } = await getArticles(
    tab === 'favorites'
      ? { favorited: username }
      : { author: username },
  )

  const tabClass = (active: boolean) => cn(
    'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
    active
      ? 'border-brand text-brand'
      : 'border-transparent text-conduit-gray hover:text-conduit-text'
  )

  return (
    <>
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isAuthenticated={!!token}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">

            <div className="flex gap-1 border-b border-conduit-border mb-4">
              <a href={`/profile/${username}`} className={tabClass(tab === 'my-articles')}>
                My Articles
              </a>
              <a href={`/profile/${username}?tab=favorites`} className={tabClass(tab === 'favorites')}>
                Favorited Articles
              </a>
            </div>

            <ArticleList articles={articles} currentUserToken={token ?? undefined} />

          </div>
        </div>
      </div>
    </>
  )
}
