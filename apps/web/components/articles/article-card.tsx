// Server Component — pas de 'use client' nécessaire
// Affiche un article en mode résumé (sans le body complet)

import { Avatar } from '@/components/ui/avatar';
import type { Article } from '@/types';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const date = new Date(article.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="border-t border-conduit-border py-6">

      {/* Ligne du haut : avatar + auteur + date + bouton favori */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${article.author.username}`}>
            <Avatar src={article.author.image} username={article.author.username} size={32} />
          </Link>
          <div className="flex flex-col">
            <Link href={`/profile/${article.author.username}`} className="text-brand font-medium text-sm hover:underline">
              {article.author.username}
            </Link>
            <span className="text-xs text-conduit-muted">{date}</span>
          </div>
        </div>

        {/* Compteur de favoris — bouton passif pour l'instant */}
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-brand text-brand rounded hover:bg-brand hover:text-white transition-colors cursor-default">
          <i className="ion-heart" /> {article.favoritesCount}
        </span>
      </div>

      {/* Lien vers l'article complet */}
      <Link href={`/article/${article.slug}`} className="block group">
        <h1 className="text-2xl font-bold text-conduit-text mb-1 group-hover:text-brand transition-colors">
          {article.title}
        </h1>
        <p className="text-conduit-gray text-sm mb-4 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-conduit-muted">Lire la suite...</span>

          {/* Tags de l'article */}
          <ul className="flex flex-wrap gap-1 justify-end">
            {article.tagList.map((tag) => (
              <li key={tag} className="px-2 py-0.5 text-xs border border-conduit-border text-conduit-gray rounded-sm">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>

    </div>
  );
}
