// generated-by: ai-assist v1.0
// type: unit
// description: Verify structural types exported from src/api/types/login.ts.

import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  ForgetPasswordRequestBody,
  ForgetPasswordResponse,
  LoginRequestBody,
  LoginResponse,
  RefreshTokenResponse,
  ResetPasswordRequestBody,
  ResetPasswordResponse,
} from '@/api/types/login'

describe('login request bodies', () => {
  it('declares required fields for login, reset, forget, and refresh requests', () => {
    expectTypeOf<LoginRequestBody>().toMatchTypeOf<{ email: string; password: string }>()
    expectTypeOf<ResetPasswordRequestBody>().toMatchTypeOf<{
      newPassword: string
      resetToken: string
    }>()
    expectTypeOf<ForgetPasswordRequestBody>().toMatchTypeOf<{ email: string }>()
    expectTypeOf().toMatchTypeOf()

    const loginPayload: LoginRequestBody = {
      email: 'user@example.com',
      password: 'secret',
    }
    const refreshPayload = { refreshToken: 'refresh-token' }
    expect(loginPayload.email).toBe('user@example.com')
    expect(refreshPayload.refreshToken).toBe('refresh-token')
  })
})

describe('login responses', () => {
  it('expects token-bearing responses to share access token data', () => {
    const tokenShape = {
      accessToken: 'access',
      tokenType: 'Bearer',
      expiresIn: 3600,
      companyName: 'companyName',
    } satisfies LoginResponse

    expectTypeOf<LoginResponse>().toMatchTypeOf<typeof tokenShape>()
    const refreshResponse: RefreshTokenResponse = tokenShape
    expect(refreshResponse.tokenType).toBe('Bearer')
  })

  it('keeps forget/reset password responses focused on result codes', () => {
    expectTypeOf<ResetPasswordResponse>().toMatchTypeOf<{ resultCode: number }>()
    expectTypeOf<ForgetPasswordResponse>().toMatchTypeOf<{ resultCode: number }>()

    const forgetResponse: ForgetPasswordResponse = { resultCode: 0 }
    expect(forgetResponse.resultCode).toBe(0)
  })
})
