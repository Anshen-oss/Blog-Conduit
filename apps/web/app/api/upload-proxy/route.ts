import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('conduit_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // On récupère le FormData envoyé par le composant Tiptap
  const formData = await req.formData()

  // On le transfère à NestJS avec le cookie JWT
  const apiRes = await fetch(`${process.env.API_URL}/upload`, {
    method: 'POST',
    headers: {
      Cookie: `jwt=${token}`,   // NestJS lit le JWT depuis ce cookie nommé 'jwt'
    },
    body: formData,
  })

  if (!apiRes.ok) {
    const error = await apiRes.text()
    return NextResponse.json({ error }, { status: apiRes.status })
  }

  const data = await apiRes.json() as { url: string }
  return NextResponse.json(data)
}
