import { SettingsForm } from '@/components/settings/settings-form';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface CurrentUser {
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
}

async function getCurrentUser(token: string): Promise<CurrentUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
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
  const token = await getAuthToken();

  // DEBUG — à supprimer après
  console.log('TOKEN:', token ? 'présent' : 'absent');
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

  if (!token) redirect('/login');

  const user = await getCurrentUser(token);
  if (!user) redirect('/login');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-lg">

          <h1 className="text-4xl font-light text-center mb-6">Your Settings</h1>
          <SettingsForm user={user} />

        </div>
      </div>
    </div>
  );
}
