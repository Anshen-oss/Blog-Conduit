'use client'

import { toggleFollowAction } from '@/actions/profile.actions'
import { useTransition } from 'react'

interface FollowButtonProps {
  username: string
  isFollowing: boolean
}

export function FollowButton({ username, isFollowing }: FollowButtonProps) {
  // useTransition : permet d'avoir isPending sans bloquer l'UI
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      await toggleFollowAction(username, isFollowing)
    })
  }

  return (
    <button
      className={`btn btn-sm ${isFollowing ? 'btn-secondary action-btn' : 'btn-outline-secondary action-btn'}`}
      onClick={handleClick}
      disabled={isPending}
    >
      <i className="ion-plus-round" />
      &nbsp;
      {isPending
        ? '...'
        : isFollowing
          ? `Unfollow ${username}`
          : `Follow ${username}`}
    </button>
  )
}
