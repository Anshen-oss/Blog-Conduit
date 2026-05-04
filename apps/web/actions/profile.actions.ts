'use server'

import { revalidatePath } from 'next/cache'
import { followUser, unfollowUser } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'

/**
 * Toggle follow/unfollow sur un profil.
 * Appelée depuis le FollowButton (Client Component).
 */
export async function toggleFollowAction(
  username: string,
  isCurrentlyFollowing: boolean,
): Promise<{ success: boolean; error?: string }> {
  const token = await getAuthToken()

  // Normalement impossible (le bouton est caché si non connecté)
  // mais on défend quand même
  if (!token) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    if (isCurrentlyFollowing) {
      await unfollowUser(username, token)
    } else {
      await followUser(username, token)
    }

    // Invalide le cache de la page profil → Next.js re-fetche les données
    revalidatePath(`/profile/${username}`)

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update follow status' }
  }
}
