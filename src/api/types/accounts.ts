export interface Account {
  accountId: number
  accountName: string
  email: string
  roleDisplayName: string
  statusCode: string
  statusDisplayName: string
  lastLogin: string
}

export type AccountListResponse = {
  total: number
  accounts: Account[]
}

export interface AccountDetail {
  accountId: number
  accountName: string
  email: string
  password: string
  roleId: number
  roleDisplayName: string
  statusCode: string
  statusDisplayName: string
}

export type AccountDetailResponse = AccountDetail

export interface AccountForm {
  accountId?: number | undefined
  accountName: string
  email: string
  roleId: number | undefined
  password?: string
}

export type AccountFormResponse = {
  resultCode: number
}
export interface AccountRole {
  roleId: number
  roleDisplayName: string
}

export type AccountRoleListResponse = {
  roles: AccountRole[]
}

export type AccountDeleteResponse = {
  resultCode: number
  accountId: number
}

export interface AccountStatus {
  accountId: number
  statusCode: string
}

export type AccountStatusResponse = {
  resultCode: number
  accountId: number
  statusCode: string
  statusDisplayName: string
}
