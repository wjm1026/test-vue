import type { Product } from './products'

export interface Project {
  projectId: string
  productImageUrl: string
  projectName: string
  startDate: string
  endDate: string
  productName: string
  janCode: string
  method: string
  point?: number
  priorityFlag?: number
  priority?: number
}

export type ProjectsResponse = {
  total: number
  projects: Project[]
}

export interface ProjectType {
  name: string
  startDate: string
  endDate: string
  method: string
  point: number
  priorityFlag: number
  priority?: number
  purchaseStartDate: string
  purchaseEndDate: string
  publishEndDate: string
  reportId?: number | null
}

export interface ProjectDetailType extends ProjectType {
  id: number
}

export type ProductsType = Omit<Product, 'productImageUrl'> & {
  imageUrl: string
}

export interface ProjectDetailData {
  project: ProjectDetailType
  products: ProductsType[]
}

export type ProjectsDetailResponse = ProjectDetailData

export interface RegistrationProjectRequestBody extends ProjectType {
  projectId?: number
  janCodes: string[]
}

export interface RegistrationProjectData {
  name: string
  startDate: string
  endDate: string
  products: ProductsType[]
  priorityFlag?: number
  priority?: number
}

export type ProjectRegistrationResponse = RegistrationProjectData

export type ProjectDeleteResponse = {
  resultCode: number
}
