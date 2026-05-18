import type { Profile } from '@/lib/api'
import { Avatar } from '../ui/avatar'
import { FollowButton } from './follow-button'

interface ProfileHeaderProps {
  profile: Profile
  isOwnProfile: boolean
  isAuthenticated: boolean
}

export function ProfileHeader({
  profile,
  isOwnProfile,
  isAuthenticated,
}: ProfileHeaderProps) {
  return (
    <div className="bg-conduit-gray-light border-b border-conduit-border py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">

          {/* Avatar rond */}
          <Avatar src={profile.image} username={profile.username} size={100} className="border-4 border-white shadow-md mb-4" />


          <h4 className="text-2xl font-bold text-conduit-text mb-2">
            {profile.username}
          </h4>

          {profile.bio && (
            <p className="text-conduit-gray text-sm max-w-md mb-4">
              {profile.bio}
            </p>
          )}

          {/* Bouton Follow */}
          {isAuthenticated && !isOwnProfile && (
            <FollowButton
              username={profile.username}
              isFollowing={profile.following}
            />
          )}

          {/* Lien Settings */}
          {isOwnProfile && (

              <a href="/settings"
              className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-conduit-gray text-conduit-gray rounded hover:border-conduit-text hover:text-conduit-text transition-colors"
            >
              <i className="ion-gear-a" />
              &nbsp; Edit Profile Settings
            </a>
          )}

        </div>
      </div>
    </div>
  )
}
