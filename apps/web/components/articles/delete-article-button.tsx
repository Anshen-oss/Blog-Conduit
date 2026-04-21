'use client';

import { deleteArticleAction } from '@/app/(main)/editor/actions';
import { useRouter } from 'next/navigation';

interface DeleteArticleButtonProps {
  slug: string;
}

export function DeleteArticleButton({ slug }: DeleteArticleButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Supprimer cet article ?')) return;
    await deleteArticleAction(slug);
    // router.push('/');
    // router.refresh();
  }

  return (
    <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
      <i className="ion-trash-a" /> Supprimer
    </button>
  );
}
