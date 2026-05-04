'use server'; // ← tout ce fichier s'exécute sur le serveur

import { revalidatePath } from 'next/cache';
import { getAuthToken } from '../auth';

// Type du state retourné au composant client
export interface UpdateUserState {
  success: boolean;
  error?: string;
}

export async function updateUser(
  _prevState: UpdateUserState | null,
  formData: FormData,
): Promise<UpdateUserState> {
  // Récupérer le token depuis le cookie (côté serveur uniquement)
   const token = await getAuthToken();

  if (!token) {
    return { success: false, error: 'Non authentifié.' };
  }

  // Extraire les champs du formulaire
  const body = {
    user: {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      bio: formData.get('bio') as string,
      image: formData.get('image') as string,
      // On n'envoie le password que s'il est renseigné
      ...(formData.get('password')
        ? { password: formData.get('password') as string }
        : {}),
    },
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    // DEBUG temporaire
const responseData = await res.json();
console.log('PUT /user status:', res.status);
console.log('PUT /user response:', JSON.stringify(responseData));

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.message ?? 'Erreur lors de la mise à jour.' };
    }

    // ⚡ Important : invalider le cache des pages qui affichent les données utilisateur
    revalidatePath('/settings');
    revalidatePath('/profile');

    return { success: true };
  } catch {
    return { success: false, error: 'Erreur réseau.' };
  }
}

