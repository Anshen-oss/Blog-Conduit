import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Type pour la réponse profil public
interface ProfileResponse {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  // Récupère un profil public avec le statut "following"
  // currentUserId peut être undefined si la requête n'est pas authentifiée
  async getProfile(
    username: string,
    currentUserId?: string,
  ): Promise<ProfileResponse> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`Profil "${username}" introuvable`);
    }

    // Par défaut : non suivi
    let isFollowing = false;

    // Si l'utilisateur est connecté, on vérifie s'il suit ce profil
    if (currentUserId) {
      const follow = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      });
      isFollowing = follow !== null;
    }

    return {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: isFollowing,
    };
  }

  // POST /api/profiles/:username/follow
  async followUser(
    username: string,
    currentUserId: string,
  ): Promise<ProfileResponse> {
    const target = await this.prisma.user.findUnique({ where: { username } });

    if (!target)
      throw new NotFoundException(`Profil "${username}" introuvable`);

    // Upsert — crée si n'existe pas, ignore si déjà présent
    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: target.id,
        },
      },
      create: { followerId: currentUserId, followingId: target.id },
      update: {}, // rien à mettre à jour si déjà existant
    });

    return {
      username: target.username,
      bio: target.bio,
      image: target.image,
      following: true,
    };
  }

  // DELETE /api/profiles/:username/follow
  async unfollowUser(
    username: string,
    currentUserId: string,
  ): Promise<ProfileResponse> {
    const target = await this.prisma.user.findUnique({ where: { username } });

    if (!target)
      throw new NotFoundException(`Profil "${username}" introuvable`);

    // deleteMany — ne plante pas si l'enregistrement n'existe pas
    await this.prisma.follow.deleteMany({
      where: { followerId: currentUserId, followingId: target.id },
    });

    return {
      username: target.username,
      bio: target.bio,
      image: target.image,
      following: false,
    };
  }
}
