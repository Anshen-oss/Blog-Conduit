'use client'

import { favoriteArticle, unfavoriteArticle } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface FavoriteButtonProps {
  slug: string
  favoritesCount: number
  favorited: boolean
  token: string
}

export function FavoriteButton({ slug, favoritesCount, favorited, token }: FavoriteButtonProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [isCurrentlyFavorited, setIsCurrentlyFavorited] = useState(favorited)
  const [currentCount, setCurrentCount] = useState(favoritesCount)

  async function handleClick() {
    setIsPending(true)
    try {
      if (isCurrentlyFavorited) {
        await unfavoriteArticle(slug, token)
        setIsCurrentlyFavorited(false)
        setCurrentCount((c) => c - 1)
      } else {
        await favoriteArticle(slug, token)
        setIsCurrentlyFavorited(true)
        setCurrentCount((c) => c + 1)
      }
      router.refresh()
    } catch {
      // silencieux — l'état optimiste est déjà mis à jour
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        isCurrentlyFavorited
          ? 'bg-brand border-brand text-white hover:bg-brand-hover'
          : 'border-brand text-brand hover:bg-brand hover:text-white'
      }`}
    >
      <i className="ion-heart" />
      <i className={isCurrentlyFavorited ? 'ion-heart' : 'ion-heart-empty'} /> article
      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full border border-current">
        {currentCount}
      </span>
    </button>
  )
}
