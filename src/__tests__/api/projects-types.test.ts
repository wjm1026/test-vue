// generated-by: ai-assist v1.0
// type: unit
// description: Type assertions for src/api/types/projects.ts exports.

import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  Project,
  ProjectDeleteResponse,
  ProjectDetailData,
  ProjectDetailType,
  ProjectRegistrationResponse,
  ProjectType,
  ProjectsDetailResponse,
  ProjectsResponse,
  ProductsType,
  RegistrationProjectData,
  RegistrationProjectRequestBody,
} from '@/api/types/projects'
import type { Product } from '@/api/types/products'

describe('Project base types', () => {
  it('defines Project with optional point', () => {
    expectTypeOf<Project>().toMatchTypeOf<{
      projectId: string
      point?: number
    }>()

    const project: Project = {
      projectId: 'p-1',
      productImageUrl: 'https://example.com/p.jpg',
      projectName: 'Launch',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      productName: 'Sample',
      janCode: '123456',
      method: 'survey',
    }
    expect(project.point).toBeUndefined()
  })

  it('links ProjectType and ProjectDetailType as documented', () => {
    expectTypeOf<ProjectDetailType>().toMatchTypeOf<ProjectType>()
    expectTypeOf<ProjectDetailType>().toMatchTypeOf<ProjectType & { id: number }>()
    expect(true).toBe(true)
  })

  it('maps ProductsType to Product with renamed image field', () => {
    type Expected = Omit<Product, 'productImageUrl'> & { imageUrl: string }
    expectTypeOf<ProductsType>().toMatchTypeOf<Expected>()
    expect(true).toBe(true)
  })
})

describe('Project responses', () => {
  it('structures ProjectsResponse with total + projects list', () => {
    expectTypeOf<ProjectsResponse>().toMatchTypeOf<{
      total: number
      projects: Project[]
    }>()

    const response: ProjectsResponse = {
      total: 1,
      projects: [
        {
          projectId: 'p-1',
          productImageUrl: 'https://example.com/p.jpg',
          projectName: 'Campaign',
          startDate: '2024-01-01',
          endDate: '2024-02-01',
          productName: 'Foo',
          janCode: '1111',
          method: 'survey',
          point: 10,
        },
      ],
    }
    expect(response.projects[0].point).toBe(10)
  })

  it('aliases detail data types consistently', () => {
    expectTypeOf<ProjectsDetailResponse>().toMatchTypeOf<ProjectDetailData>()
    expectTypeOf<ProjectDetailData>().toMatchTypeOf<{
      project: ProjectDetailType
      products: ProductsType[]
    }>()
    expect(true).toBe(true)
  })

  it('covers registration responses and delete codes', () => {
    expectTypeOf<ProjectRegistrationResponse>().toMatchTypeOf<RegistrationProjectData>()
    expectTypeOf<ProjectDeleteResponse>().toMatchTypeOf<{ resultCode: number }>()
    expect(true).toBe(true)
  })
})

describe('Registration request', () => {
  it('extends ProjectType with optional projectId and janCodes array', () => {
    expectTypeOf<RegistrationProjectRequestBody>().toMatchTypeOf<ProjectType>()
    expectTypeOf<RegistrationProjectRequestBody>().toMatchTypeOf<
      ProjectType & { projectId?: number; janCodes: string[] }
    >()

    const payload: RegistrationProjectRequestBody = {
      name: 'Launch',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      method: 'survey',
      point: 10,
      janCodes: ['1111', '2222'],
      priorityFlag: 0,
      purchaseStartDate: '2024-01-01',
      purchaseEndDate: '2024-02-01',
      publishEndDate: '2024-03-01',
    }
    expect(payload.janCodes).toHaveLength(2)
  })
})
