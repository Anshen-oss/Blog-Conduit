'use client'


import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { useActionState, useState } from 'react'
import { createArticleAction } from './actions'

export default function EditorPage() {
  const [body, setBody] = useState('')
  const [state, formAction, isPending] = useActionState(createArticleAction, null)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form action={formAction} className="space-y-4">
        {/* Le body HTML est transmis via un champ caché */}
        <input type="hidden" name="body" value={body} />

        <input
          type="text"
          name="title"
          placeholder="Titre de l'article"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Résumé en une phrase"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />

        <TiptapEditor
          content=""
          onChange={setBody}
          placeholder="Écris ton article ici... (tu peux insérer des images)"
        />

        <input
          type="text"
          name="tagList"
          placeholder="Tags (séparés par des virgules)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />

        {state?.error && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending || body.trim() === ''}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? 'Publication...' : 'Publier'}
        </button>
      </form>
    </div>
  )
}
