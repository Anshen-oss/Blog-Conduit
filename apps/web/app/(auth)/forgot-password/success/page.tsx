export default function ForgotPasswordSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Email envoyé !
        </h1>
        <p className="text-gray-500 mb-6">
          Si cet email est enregistré, tu recevras un lien de réinitialisation dans quelques secondes.
          Pense à vérifier tes spams.
        </p>
        <a href="/login" className="text-green-600 hover:underline text-sm">
          ← Retour à la connexion
        </a>
      </div>
    </div>
  );
}
