import { getArticle } from '@/lib/api'
import { getAuthToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { updateArticleAction } from '../actions'
import { EditArticleForm } from '../edit-article-form'

interface EditEditorPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditEditorPage({ params }: EditEditorPageProps) {
  const { slug } = await params

  const token = await getAuthToken()
  if (!token) redirect('/login')

  const { article } = await getArticle(slug)

  const updateAction = updateArticleAction.bind(null, slug)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <EditArticleForm article={article} updateAction={updateAction} />
    </div>
  )
}
