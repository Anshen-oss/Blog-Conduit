'use server';  // Tout ce fichier s'exécute côté serveur

import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

// ─── Créer un article ─────────────────────────────────────────────────────────

export async function createArticleAction(formData: FormData) {
  const token = await getAuthToken();

  if (!token) redirect('/login');  // Protection : non connecté → login

  const tagList = (formData.get('tagList') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);  // Supprime les tags vides

  const res = await fetch(`${process.env.API_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `jwt=${token}`,
    },
    body: JSON.stringify({
      article: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        body: formData.get('body') as string,
        tagList,
      },
    }),
  });

  if (!res.ok) {
    // En cas d'erreur — on pourrait retourner un état d'erreur ici
    // Pour l'instant, on redirige vers la homepage
    redirect('/');
  }

  const data = await res.json() as { article: { slug: string } };
  redirect(`/article/${data.article.slug}`);
}

// ─── Modifier un article ──────────────────────────────────────────────────────

export async function updateArticleAction(slug: string, formData: FormData) {
   const token = await getAuthToken();

  if (!token) redirect('/login');

  const tagList = (formData.get('tagList') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const res = await fetch(`${process.env.API_URL}/articles/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `jwt=${token}`,
    },
    body: JSON.stringify({
      article: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        body: formData.get('body') as string,
        tagList,
      },
    }),

  });
if (!res.ok) {
  const err = await res.json();
  console.log('UPDATE ERROR:', err);
  redirect('/');
}

  const data = await res.json() as { article: { slug: string } };
  redirect(`/article/${data.article.slug}`);
}

export async function deleteArticleAction(slug: string) {
  const token = await getAuthToken();
  if (!token) redirect('/login');

  const res = await fetch(`${process.env.API_URL}/articles/${slug}`, {
    method: 'DELETE',
    headers: { Cookie: `jwt=${token}` },
  });

  console.log('DELETE STATUS:', res.status);  // ← ajoute cette ligne


  redirect('/');  // ← redirect côté serveur, plus fiable
}
