// Server Component async — toute la logique de fetch est ici
// Pas de useState, pas de useEffect : on fetch directement

import { ArticleCard } from '@/components/articles/article-card';
import { getArticles, getArticlesFeed, getTags } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { Article } from '@/types';
import Link from 'next/link';



interface HomePageProps {
  searchParams: Promise<{
    tag?: string;
    page?: string;
    feed?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { tag, page = '1', feed } = await searchParams;
  const offset = (parseInt(page) - 1) * 10;
  const limit = 10;

  const TAG_COLORS = [
  'bg-blue-500 text-white hover:bg-blue-600',
  'bg-pink-500 text-white hover:bg-pink-600',
  'bg-emerald-500 text-white hover:bg-emerald-600',
  'bg-amber-500 text-white hover:bg-amber-600',
  'bg-violet-500 text-white hover:bg-violet-600',
  'bg-red-500 text-white hover:bg-red-600',
  'bg-cyan-500 text-white hover:bg-cyan-600',
]

  const token = await getAuthToken();

const [articlesData, tagsData] = await Promise.all([
  feed && token
    ? getArticlesFeed(token, { limit, offset })
    : getArticles({ ...(tag && { tag }), limit, offset }),
  getTags(),
]) as [{ articles: Article[]; articlesCount: number }, { tags: string[] }];

  const { articles, articlesCount } = articlesData;
  const totalPages = Math.ceil(articlesCount / limit);

  return (
    <div>
      {/* Banner héro — visible uniquement si non connecté */}
      {!token && (
        <div className="bg-brand text-white text-center py-8 mb-8 shadow-inner">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold tracking-tight mb-2">conduit</h1>
            <p className="text-xl font-light opacity-90">A place to share your knowledge.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Colonne principale : onglets + liste articles */}
          <div className="flex-1 min-w-0">

            {/* Onglets */}
            <div className="flex gap-1 border-b border-conduit-border mb-4">
              {token && (
                <Link
                  href="/?feed=true"
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    feed
                      ? 'border-brand text-brand'
                      : 'border-transparent text-conduit-gray hover:text-conduit-text'
                  }`}
                >
                  Your Feed
                </Link>
              )}
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  !feed && !tag
                    ? 'border-brand text-brand'
                    : 'border-transparent text-conduit-gray hover:text-conduit-text'
                }`}
              >
                Global Feed
              </Link>
              {tag && (
                <span className="px-4 py-2 text-sm font-medium border-b-2 border-brand text-brand -mb-px">
                  <i className="ion-pound" /> {tag}
                </span>
              )}
            </div>

            {/* Liste des articles */}
            {articles.length === 0 ? (
              <p className="py-6 text-conduit-muted">Aucun article.</p>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <ul className="flex gap-1 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p}>
                    <Link
                      href={`/?page=${p}${tag ? `&tag=${tag}` : ''}${feed ? '&feed=true' : ''}`}
                      className={`inline-flex items-center justify-center w-8 h-8 text-sm rounded transition-colors ${
                        parseInt(page) === p
                          ? 'bg-brand text-white'
                          : 'text-brand border border-brand hover:bg-brand hover:text-white'
                      }`}
                    >
                      {p}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sidebar : tags populaires */}
          <div className="w-56 shrink-0 mt-10">
            <div className="bg-conduit-gray-light rounded p-4">
              <p className="text-sm font-medium text-conduit-text mb-3">Popular Tags</p>
            <div className="flex flex-wrap gap-1">
              {tagsData.tags.map((t, i) => (
                <Link
                  key={t}
                  href={`/?tag=${t}`}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors leading-none ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  {t}
                </Link>
              ))}
            </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
