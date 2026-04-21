// Server Component — pas de 'use client' nécessaire
// Affiche un article en mode résumé (sans le body complet)

import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

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
    <div className="article-preview">
      {/* Ligne du haut : avatar + auteur + date + bouton favori */}
      <div className="article-meta">
        <Link href={`/profile/${article.author.username}`}>
          <Image
            src={article.author.image ?? 'https://api.realworld.io/images/smiley-cyrus.jpg'}
            alt={article.author.username}
            width={32}
            height={32}
          />
        </Link>
        <div className="info">
          <Link href={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{date}</span>
        </div>
        {/* Compteur de favoris — bouton passif pour l'instant */}
        <span className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart" /> {article.favoritesCount}
        </span>
      </div>

      {/* Lien vers l'article complet */}
      <Link href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Lire la suite...</span>
        {/* Tags de l'article */}
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
