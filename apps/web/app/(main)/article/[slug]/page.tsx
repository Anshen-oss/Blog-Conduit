import { DeleteArticleButton } from '@/components/articles/delete-article-button';
import { getArticle, getComments, getCurrentUser } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';


interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Lire le cookie JWT
  const token = await getAuthToken();

  // Fetch article + commentaires + user courant en parallèle
const [articleData, commentsData, currentUser] = await Promise.all([
    getArticle(slug).catch((err) => { console.log('ARTICLE ERROR:', err); return null; }),
    getComments(slug).catch(() => ({ comments: [] })),
    token ? getCurrentUser(token).catch(() => null) : null,
  ]);

  // Si l'article n'existe pas → page 404
  if (!articleData) notFound();

  const { article } = articleData;
  const { comments } = commentsData;
  const isAuthor = currentUser?.user.username === article.author.username;

  const date = new Date(article.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="article-page">
      {/* Header sombre avec titre */}
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

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

            {/* Boutons éditer/supprimer — visibles uniquement pour l'auteur */}
            {isAuthor && (
              <>
                <Link
                  href={`/editor/${article.slug}`}
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="ion-edit" /> Modifier
                </Link>
                {' '}
                {/* Client Component pour la confirmation de suppression */}
                <DeleteArticleButton slug={article.slug} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Corps de l'article */}
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article.body}</p>
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        {/* Section commentaires */}
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {comments.map((comment) => (
              <div key={comment.id} className="card">
                <div className="card-block">
                  <p className="card-text">{comment.body}</p>
                </div>
                <div className="card-footer">
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className="comment-author"
                  >
                    {comment.author.username}
                  </Link>
                </div>
              </div>
            ))}

            {!token && (
              <p>
                <Link href="/login">Connecte-toi</Link> pour laisser un commentaire.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
