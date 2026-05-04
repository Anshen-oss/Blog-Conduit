import type { Profile } from '@/lib/api'
import Image from 'next/image'
import { FollowButton } from './follow-button'

interface ProfileHeaderProps {
  profile: Profile
  isOwnProfile: boolean  // true si c'est notre propre profil → pas de bouton follow
  isAuthenticated: boolean
}

export function ProfileHeader({
  profile,
  isOwnProfile,
  isAuthenticated,
}: ProfileHeaderProps) {
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">

              {/* Avatar — utilise next/image pour l'optimisation */}
              <Image
                src={profile.image ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
                alt={profile.username}
                width={100}
                height={100}
                className="user-img"
              />

              <h4>{profile.username}</h4>

              {profile.bio && <p>{profile.bio}</p>}

              {/* Bouton Follow : visible si connecté ET pas notre propre profil */}
              {isAuthenticated && !isOwnProfile && (
                <FollowButton
                  username={profile.username}
                  isFollowing={profile.following}
                />
              )}

              {/* Lien Settings : visible si c'est notre propre profil */}
              {isOwnProfile && (
                <a href="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                  <i className="ion-gear-a" />
                  &nbsp; Edit Profile Settings
                </a>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
