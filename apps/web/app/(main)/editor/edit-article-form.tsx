'use client'

import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { useActionState, useState } from 'react'

interface EditArticleFormProps {
  article: {
    title: string
    description: string
    body: string
    slug: string
    tagList: string[]
  }
  // Après .bind(null, slug), slug est pré-rempli
  // Il reste donc (_prevState, formData) comme signature
  updateAction: (
    prevState: { error: string } | null,
    formData: FormData
  ) => Promise<{ error: string } | null>
}

export function EditArticleForm({ article, updateAction }: EditArticleFormProps) {
  const [body, setBody] = useState(article.body)
  const [state, formAction, isPending] = useActionState<{ error: string } | null, FormData>(
    updateAction,   // ← utiliser la prop au lieu de updateArticleAction directement
    null
  )

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={article.slug} />
      <input type="hidden" name="body" value={body} />

      <input
        type="text"
        name="title"
        defaultValue={article.title}
        placeholder="Titre de l'article"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        required
      />

      <input
        type="text"
        name="description"
        defaultValue={article.description}
        placeholder="Résumé en une phrase"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        required
      />

      <TiptapEditor
        content={article.body}
        onChange={setBody}
      />

      <input
        type="text"
        name="tagList"
        defaultValue={article.tagList.join(', ')}
        placeholder="Tags (séparés par des virgules)"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />

      {state?.error && (
        <p className="text-red-500 text-sm">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? 'Mise à jour...' : 'Mettre à jour'}
      </button>
    </form>
  )
}
