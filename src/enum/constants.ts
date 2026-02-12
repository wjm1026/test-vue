export const defaultPage = 1
export const pageSize = 10

export const pattern = {
  password:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=])[A-Za-z0-9!@#$%^&*()_+\-=]{12,64}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  priority: /^(?:[1-9]|10)$/,
  janCode: /^[A-Za-z0-9]+$/,
}

// Date formats
export const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm'
export const DATE_FORMAT_YYYY_MM_DD = 'YYYY-MM-DD'

// Account status codes
export enum AccountStatusCode {
  Active = '00',
  Inactive = '01',
  Pending = '02',
}

// Account role display names
export enum AccountRoleDisplayName {
  RepresentativeAdmin = '代表管理者',
  ManagementUser = '管理者ユーザー',
  GeneralUser = '一般ユーザー',
}

export enum ResultCodeEnum {
  Success = 1,
  Error = 9,
}

export const HTTP_STATUS_UNAUTHORIZED = 401
export const HTTP_STATUS_SERVER_ERROR = 500
export const REQUEST_TIMEOUT = 10000
export const DEFAULT_ERROR_MESSAGE = 'エラーが発生しました'

// Date range status for projects
export enum DateRangeStatus {
  NotStarted = 'not_started',
  Ongoing = 'ongoing',
  Ended = 'ended',
}
