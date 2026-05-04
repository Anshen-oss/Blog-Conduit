import type { Article } from '@/types'
import { ArticleCard } from './article-card'

interface ArticleListProps {
  articles: Article[]
  currentUserToken?: string
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <div className="article-preview">Aucun article.</div>
  }

  return (
    <>
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </>
  )
}
