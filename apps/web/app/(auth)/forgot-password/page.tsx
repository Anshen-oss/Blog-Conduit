import { forgotPasswordAction } from '@/actions/auth.actions';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Mot de passe oublié ?
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Saisis ton adresse email et on t'envoie un lien de réinitialisation.
        </p>

        <form action={forgotPasswordAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="toi@exemple.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            Envoyer le lien de reset
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          <a href="/login" className="text-green-600 hover:underline">
            ← Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  );
}
