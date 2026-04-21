// Page de création d'article — protégée (redirige si non connecté)

import { SubmitButton } from '@/components/articles/submit-button';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createArticleAction } from './actions';

export default async function NewEditorPage() {
  // Vérification côté serveur : non connecté → login
  const token = await getAuthToken();
  if (!token) redirect('/login');

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {/* action={createArticleAction} : Next.js passe le FormData automatiquement */}
            <form action={createArticleAction}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    name="title"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    name="description"
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    name="body"
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    name="tagList"
                    type="text"
                    className="form-control"
                    placeholder="Enter tags (séparés par des virgules)"
                  />
                </fieldset>
                <SubmitButton label="Publish Article" />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
