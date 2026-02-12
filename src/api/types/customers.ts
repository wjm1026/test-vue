export interface Customer {
  userId: string
  nickname: string
  ageGroup: string
  gender: string
  totalReviews: number
  status?: 'public' | 'private'
  updatedAt: string
}

export interface CustomerDetail extends Customer {
  totalLikes: number
}

export type CustomerListResponse = {
  total: number
  users: Customer[]
}

export type CustomerDetailResponse = CustomerDetail
