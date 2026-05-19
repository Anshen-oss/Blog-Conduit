import { type Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign In',
}

interface Props {
  searchParams: Promise<{ reset?: string }>;
}

interface Props {
  searchParams: Promise<{ reset?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { reset } = await searchParams;
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md">

            <h1 className="text-4xl font-light text-center mb-2">Sign in</h1>
            <p className="text-center text-sm mb-6">
              <a href="/register" className="text-brand hover:underline">
                Need an account?
              </a>
            </p>
            {reset === 'success' && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                    ✅ Mot de passe réinitialisé ! Tu peux te connecter.
              </div>
           )}
          <LoginForm />

          </div>
        </div>
      </div>
    </div>
  )
}
