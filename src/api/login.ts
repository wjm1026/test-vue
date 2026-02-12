import { createApiRequest } from './request'
import type {
  ForgetPasswordRequestBody,
  ForgetPasswordResponse,
  LoginRequestBody,
  LoginResponse,
  RefreshTokenResponse,
  ResetPasswordRequestBody,
  ResetPasswordResponse,
} from './types/login'
import type { ExtendedAxiosRequestConfig } from './api-instance'

import { toCamelCaseKeys } from '@/util/camel-case'
import forgetPasswordResponse from '@/mocks/data/login/forgetPassword.json'
import loginResponse from '@/mocks/data/login/login.json'
import refreshTokenResponse from '@/mocks/data/login/refreshToken.json'
import resetPasswordResponse from '@/mocks/data/login/resetPassword.json'

const requestLogin = createApiRequest<LoginResponse>(toCamelCaseKeys(loginResponse))
const requestResetPassword = createApiRequest<ResetPasswordResponse>(
  toCamelCaseKeys(resetPasswordResponse),
)
const requestForgetPassword = createApiRequest<ForgetPasswordResponse>(
  toCamelCaseKeys(forgetPasswordResponse),
)
const requestRefreshToken = createApiRequest<RefreshTokenResponse>(
  toCamelCaseKeys(refreshTokenResponse),
)

export const login = (data: LoginRequestBody) =>
  requestLogin({
    url: '/login',
    method: 'POST',
    data,
    skipAuthGuard: true,
  } as ExtendedAxiosRequestConfig)

export const resetPassword = (data: ResetPasswordRequestBody) =>
  requestResetPassword({
    url: '/reset',
    method: 'POST',
    data,
    skipAuthGuard: true,
  } as ExtendedAxiosRequestConfig)

export const forgetPassword = (data: ForgetPasswordRequestBody) =>
  requestForgetPassword({
    url: '/reset-request',
    method: 'POST',
    data,
    skipAuthGuard: true,
  } as ExtendedAxiosRequestConfig)

export const refreshToken = () =>
  requestRefreshToken({
    url: '/refresh',
    method: 'POST',
    skipAuthGuard: true,
  } as ExtendedAxiosRequestConfig)
