// Server Component async — toute la logique de fetch est ici
// Pas de useState, pas de useEffect : on fetch directement

import { cookies } from 'next/headers';
import Link from 'next/link';
import { getArticles, getArticlesFeed, getTags } from '@/lib/api';
import { ArticleCard } from '@/components/articles/article-card';

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

  // Lire le JWT pour savoir si l'utilisateur est connecté
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  // Fetch articles et tags en parallèle — plus rapide
  const [articlesData, tagsData] = await Promise.all([
    feed && token
      ? getArticlesFeed(token, { limit, offset })
      : getArticles({ tag, limit, offset }),
    getTags(),
  ]);

  const { articles, articlesCount } = articlesData;
  const totalPages = Math.ceil(articlesCount / limit);

  return (
    <div className="home-page">
      {/* Banner héro — visible uniquement si non connecté */}
      {!token && (
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      )}

      <div className="container page">
        <div className="row">
          {/* Colonne principale : onglets + liste articles */}
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {/* Onglet "Your Feed" — visible uniquement si connecté */}
                {token && (
                  <li className="nav-item">
                    <Link
                      href="/?feed=true"
                      className={`nav-link ${feed ? 'active' : ''}`}
                    >
                      Your Feed
                    </Link>
                  </li>
                )}
                {/* Onglet "Global Feed" */}
                <li className="nav-item">
                  <Link
                    href="/"
                    className={`nav-link ${!feed && !tag ? 'active' : ''}`}
                  >
                    Global Feed
                  </Link>
                </li>
                {/* Onglet tag actif si un tag est sélectionné */}
                {tag && (
                  <li className="nav-item">
                    <span className="nav-link active">
                      <i className="ion-pound" /> {tag}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Liste des articles */}
            {articles.length === 0 ? (
              <div className="article-preview">Aucun article.</div>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li
                    key={p}
                    className={`page-item ${parseInt(page) === p ? 'active' : ''}`}
                  >
                    <Link
                      href={`/?page=${p}${tag ? `&tag=${tag}` : ''}${feed ? '&feed=true' : ''}`}
                      className="page-link"
                    >
                      {p}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sidebar : tags populaires */}
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {tagsData.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/?tag=${t}`}
                    className="tag-pill tag-default"
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
