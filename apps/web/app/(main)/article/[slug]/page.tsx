import { DeleteArticleButton } from '@/components/articles/delete-article-button';
import { getArticle, getComments, getCurrentUser } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FavoriteButton } from '@/components/articles/favorite-button';
import { Avatar } from '@/components/ui/avatar';
import type { Metadata } from 'next';

interface ArticleSeoData {
  title: string;
  description: string;
  author: { username: string };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return { title: 'Article introuvable' };

    const { article } = await res.json() as { article: ArticleSeoData };

    return {
      title: article.title,
      description: article.description,
      openGraph: {
        title: article.title,
        description: article.description,
        type: 'article',
        authors: [`/profile/${article.author.username}`],
      },
    };
  } catch {
    return { title: 'Conduit' };
  }
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const token = await getAuthToken();

  const [articleData, commentsData, currentUser] = await Promise.all([
    getArticle(slug).catch((err) => { console.log('ARTICLE ERROR:', err); return null; }),
    getComments(slug).catch(() => ({ comments: [] })),
    token ? getCurrentUser(token).catch(() => null) : null,
  ]);

  if (!articleData) notFound();

  const { article } = articleData;
  const { comments } = commentsData;
  const isAuthor = currentUser?.user.username === article.author.username;

  const date = new Date(article.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div>
      {/* Banner sombre avec titre */}
      <div className="bg-stone-800 text-white py-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">{article.title}</h1>

          <div className="flex items-center gap-4">
            <Link href={`/profile/${article.author.username}`}>
              <Avatar src={article.author.image} username={article.author.username} size={36} />
            </Link>
            <div className="flex flex-col">
              <Link href={`/profile/${article.author.username}`} className="text-brand font-medium text-sm hover:underline">
                {article.author.username}
              </Link>
              <span className="text-xs text-stone-400">{date}</span>
            </div>

            {/* Boutons éditer/supprimer — visibles uniquement pour l'auteur */}
            {isAuthor && (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/editor/${article.slug}`}
                  className="px-3 py-1 text-sm border border-stone-400 text-stone-300 rounded hover:border-white hover:text-white transition-colors"
                >
                  <i className="ion-edit" /> Modifier
                </Link>
                <DeleteArticleButton slug={article.slug} />
              </div>
            )}
            {/* Après le bloc isAuthor, dans le banner */}
            {token && !isAuthor && (
              <FavoriteButton
                slug={article.slug}
                favoritesCount={article.favoritesCount}
                favorited={article.favorited}
                token={token}
              />
            )}
          </div>
        </div>
      </div>

      {/* Corps de l'article */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Texte */}
          <p className="text-conduit-text text-lg leading-relaxed whitespace-pre-wrap mb-6">
            {article.body}
          </p>

          {/* Tags */}
          <ul className="flex flex-wrap gap-2 mb-8">
            {article.tagList.map((tag) => (
              <li key={tag} className="px-3 py-0.5 text-sm border border-conduit-border text-conduit-gray rounded-full">
                {tag}
              </li>
            ))}
          </ul>

          <hr className="border-conduit-border mb-8" />

          {/* Section commentaires */}
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border border-conduit-border rounded overflow-hidden">
                <div className="px-4 py-3">
                  <p className="text-conduit-text text-sm">{comment.body}</p>
                </div>
                <div className="px-4 py-2 bg-conduit-gray-light border-t border-conduit-border">
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className="text-sm text-brand font-medium hover:underline"
                  >
                    {comment.author.username}
                  </Link>
                </div>
              </div>
            ))}

            {!token && (
              <p className="text-sm text-conduit-gray">
                <Link href="/login" className="text-brand hover:underline">Connecte-toi</Link>
                {' '}pour laisser un commentaire.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
