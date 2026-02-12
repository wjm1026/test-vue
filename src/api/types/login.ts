export type LoginRequestBody = {
  password: string
  email: string
}

export type LoginResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
  companyName: string
}

export type ResetPasswordRequestBody = {
  newPassword: string
  resetToken: string
}

export type ResetPasswordResponse = {
  resultCode: number
}

export type ForgetPasswordRequestBody = {
  email: string
}

export type ForgetPasswordResponse = {
  resultCode: number
}

export type RefreshTokenResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
}
