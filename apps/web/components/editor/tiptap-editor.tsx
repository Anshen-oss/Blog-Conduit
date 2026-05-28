'use client'  // Tiptap est interactif → obligatoirement un Client Component

import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRef } from 'react'

interface TiptapEditorProps {
  content: string                    // contenu HTML initial
  onChange: (html: string) => void   // remonté au parent à chaque frappe
  placeholder?: string
}

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,           // gras, italique, listes, titres, code, blockquote...
      Image.configure({
        inline: false,      // les images occupent leur propre ligne
        allowBase64: false, // on passe par Tigris, pas base64
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Écris ton article ici...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,  // évite l'erreur d'hydratation Next.js
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const formData = new FormData()
    formData.append('file', file)   // 'file' doit matcher FileInterceptor('file') côté NestJS

    try {
      const res = await fetch('/api/upload-proxy', {
        method: 'POST',
        body: formData,
        credentials: 'include',  // envoie les cookies (httpOnly JWT)
      })

      if (!res.ok) throw new Error('Upload échoué')

      const data = await res.json() as { url: string }

      // Insère l'image dans l'éditeur à la position actuelle du curseur
      editor.chain().focus().setImage({ src: data.url }).run()
    } catch (err) {
      console.error('Erreur upload image:', err)
      alert("L'upload de l'image a échoué.")
    } finally {
      // Réinitialise l'input pour permettre de re-sélectionner le même fichier
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (!editor) return null

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Barre d'outils */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Gras"
        >
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italique"
        >
          <em>I</em>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Barré"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Titre H2"
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Titre H3"
        >
          H3
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Liste à puces"
        >
          •—
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Liste numérotée"
        >
          1.
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Bloc de code"
        >
          {'</>'}
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          active={false}
          title="Insérer une image"
        >
          🖼
        </ToolbarButton>

        {/* Input caché — déclenché par le bouton image */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Zone d'édition */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  )
}

// Bouton réutilisable pour la toolbar
function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"   // IMPORTANT : évite de soumettre le formulaire parent au clic
      onClick={onClick}
      title={title}
      className={`
        px-2 py-1 rounded text-sm font-mono transition-colors
        ${active
          ? 'bg-gray-800 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100'
        }
      `}
    >
      {children}
    </button>
  )
}
