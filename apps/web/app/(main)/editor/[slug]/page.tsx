// Page de modification d'article — pré-remplit le formulaire avec les données existantes

import { SubmitButton } from '@/components/articles/submit-button';
import { getArticle } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { updateArticleAction } from '../actions';

interface EditEditorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditEditorPage({ params }: EditEditorPageProps) {
  const { slug } = await params;

  const token = await getAuthToken();
  if (!token) redirect('/login');

  // Charger l'article existant pour pré-remplir le formulaire
  const { article } = await getArticle(slug);

  // Lier la Server Action au slug courant avec bind
  // → updateArticleAction attend (slug, formData) mais action= ne passe que formData
  const updateAction = updateArticleAction.bind(null, slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">

          <form action={updateAction}>
            <fieldset className="flex flex-col gap-4">

              {/* Titre */}
              <input
                name="title"
                type="text"
                className="w-full px-6 py-4 text-2xl border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand"
                placeholder="Article Title"
                defaultValue={article.title}
                required
              />

              {/* Description */}
              <input
                name="description"
                type="text"
                className="w-full px-4 py-3 text-base border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand"
                placeholder="What's this article about?"
                defaultValue={article.description}
                required
              />

              {/* Corps */}
              <textarea
                name="body"
                rows={8}
                className="w-full px-4 py-3 text-base border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand resize-y"
                placeholder="Write your article (in markdown)"
                defaultValue={article.body}
                required
              />

              {/* Tags */}
              <input
                name="tagList"
                type="text"
                className="w-full px-4 py-3 text-base border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand"
                placeholder="Enter tags"
                defaultValue={article.tagList.join(', ')}
              />

              {/* Bouton submit aligné à droite */}
              <div className="flex justify-end">
                <SubmitButton label="Update Article" />
              </div>

            </fieldset>
          </form>

        </div>
      </div>
    </div>
  );
}
