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
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form action={updateAction}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    name="title"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    defaultValue={article.title}       // Pré-rempli !
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    name="description"
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    defaultValue={article.description}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    name="body"
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    defaultValue={article.body}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    name="tagList"
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    defaultValue={article.tagList.join(', ')}
                  />
                </fieldset>
                <SubmitButton label="Update Article" />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
