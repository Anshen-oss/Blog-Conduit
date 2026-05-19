import { resetPasswordAction } from '@/actions/auth.actions';

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Lien invalide. Demande un nouveau lien de reset.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Nouveau mot de passe
        </h1>

        <form action={resetPasswordAction} className="space-y-4">
          {/* Token caché — transmis au Server Action */}
          <input type="hidden" name="token" value={token} />

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Minimum 8 caractères"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}
