import { SettingsForm } from '@/components/settings/settings-form';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Typage de la réponse API /api/user
interface CurrentUser {
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
}

// Récupère l'utilisateur courant depuis NestJS
async function getCurrentUser(token: string): Promise<CurrentUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
      // 'no-store' : ne jamais mettre en cache les données utilisateur
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export default async function SettingsPage() {
  // Étape 1 : lire le cookie côté serveur
  const token = await getAuthToken();

   // DEBUG — à supprimer après
  console.log('TOKEN:', token ? 'présent' : 'absent');
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

  // Étape 2 : pas de token → redirect immédiat (avant tout rendu)
  if (!token) redirect('/login');

  // Étape 3 : charger l'utilisateur pour pré-remplir le formulaire
  const user = await getCurrentUser(token);
  if (!user) redirect('/login'); // token invalide ou expiré

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            {/* On passe l'utilisateur au formulaire client */}
            <SettingsForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
