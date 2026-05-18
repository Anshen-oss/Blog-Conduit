import { type Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function LoginPage() {
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

            <LoginForm />

          </div>
        </div>
      </div>
    </div>
  )
}
