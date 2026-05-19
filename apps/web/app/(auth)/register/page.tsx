import { type Metadata } from 'next'
import { RegisterForm } from './register-form'

export const metadata: Metadata = {
  title: 'Sign Up — Conduit',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Sign up</h1>
        <p className="text-center text-gray-500 mb-6">
          <a href="/login" className="text-green-600 hover:underline">Have an account?</a>
        </p>
        <RegisterForm />
      </div>
    </div>
  )
}
