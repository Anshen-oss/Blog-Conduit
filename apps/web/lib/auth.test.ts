// apps/web/__tests__/lib/auth.test.ts
// Note: les Server Actions sont difficiles à tester unitairement car elles
// dépendent du contexte Next.js. On teste les helpers purs.

import { ApiError } from '@/lib/api'

describe('ApiError', () => {
  it('devrait créer une erreur avec le bon status et les bonnes erreurs', () => {
    const errors = { email: ['has already been taken'] }
    const error = new ApiError(422, errors)

    expect(error.status).toBe(422)
    expect(error.errors).toEqual(errors)
    expect(error.name).toBe('ApiError')
  })

  it('devrait être instanceof Error', () => {
    const error = new ApiError(401, {})
    expect(error instanceof Error).toBe(true)
  })
})
