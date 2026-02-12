export enum UseApiStub {
  TRUE = 'true',
  FALSE = 'false',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export enum UserRoleEnum {
  RepresentativeAdmin = 'represent', // 代表管理者
  ManagementUser = 'admin', // 管理ユーザー
  GeneralUser = 'general', // 一般ユーザー
}

export * from './comments'
export * from './constants'
export * from './product'
