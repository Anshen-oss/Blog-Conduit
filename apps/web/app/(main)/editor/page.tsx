// Page de création d'article — protégée (redirige si non connecté)

import { SubmitButton } from '@/components/articles/submit-button';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createArticleAction } from './actions';

export default async function NewEditorPage() {
  const token = await getAuthToken();
  if (!token) redirect('/login');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">

          <form action={createArticleAction}>
            <fieldset className="flex flex-col gap-4">

              {/* Titre */}
              <input
                name="title"
                type="text"
                className="w-full px-6 py-4 text-2xl border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand"
                placeholder="Article Title"
                required
              />

              {/* Description */}
              <input
                name="description"
                type="text"
                className="w-full px-4 py-3 text-base border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand"
                placeholder="What's this article about?"
                required
              />

              {/* Corps */}
              <textarea
                name="body"
                rows={8}
                className="w-full px-4 py-3 text-base border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand resize-y"
                placeholder="Write your article (in markdown)"
                required
              />

              {/* Tags */}
              <input
                name="tagList"
                type="text"
                className="w-full px-4 py-3 text-base border border-conduit-border rounded outline-none transition-colors placeholder:text-conduit-muted focus:border-brand focus:ring-1 focus:ring-brand"
                placeholder="Enter tags (séparés par des virgules)"
              />

              {/* Bouton submit aligné à droite */}
              <div className="flex justify-end">
                <SubmitButton label="Publish Article" />
              </div>

            </fieldset>
          </form>

        </div>
      </div>
    </div>
  );
}
