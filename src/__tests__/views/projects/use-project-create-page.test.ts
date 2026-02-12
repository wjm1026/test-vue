import { describe, expect, it } from 'vitest'

import { useProjectCreatePage } from '@/views/projects/create/useProjectCreatePage'
import type { ProductsType, RegistrationProjectData } from '@/api/types/projects'

describe('useProjectCreatePage', () => {
  it('initializes with defaults', () => {
    const comp = useProjectCreatePage()
    expect(comp.createVisible.value).toBe(false)
    expect(comp.project.name).toBe('')
    expect(comp.project.startDate).toBe('')
    expect(comp.project.endDate).toBe('')
    expect(Array.isArray(comp.project.products)).toBe(true)
  })

  it('successProjectSubmit updates project and shows dialog', () => {
    const comp = useProjectCreatePage()
    const payload: RegistrationProjectData = {
      name: 'Proj',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      products: [],
    }
    comp.successProjectSubmit(payload)
    expect(comp.project.name).toBe('Proj')
    expect(comp.project.startDate).toBe('2025-01-01')
    expect(comp.project.endDate).toBe('2025-01-31')
    expect(comp.createVisible.value).toBe(true)
  })

  it('successProjectSubmit does not update products array', () => {
    // Purpose: verify products array is not updated by successProjectSubmit (only name, dates are updated).
    const comp = useProjectCreatePage()
    const initialProducts: ProductsType[] = [
      {
        createdAt: '2024-01-01',
        productName: 'Initial Product',
        maker: 'Maker',
        janCode: 'JAN-000',
        imageUrl: 'https://example.com/image.png',
      },
    ]
    comp.project.products = initialProducts

    const payload: RegistrationProjectData = {
      name: 'Proj',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      products: [
        {
          createdAt: '2024-02-01',
          productName: 'Product 1',
          maker: 'Maker',
          janCode: 'JAN-001',
          imageUrl: 'https://example.com/product.png',
        },
      ],
    }
    comp.successProjectSubmit(payload)
    expect(comp.project.name).toBe('Proj')
    expect(comp.project.startDate).toBe('2025-01-01')
    expect(comp.project.endDate).toBe('2025-01-31')
    expect(comp.project.products).toEqual(initialProducts)
  })

  it('successProjectSubmit can be called multiple times with different data', () => {
    // Purpose: ensure dialog can be reopened with new project data.
    const comp = useProjectCreatePage()
    const firstPayload: RegistrationProjectData = {
      name: 'First Proj',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      products: [],
    }
    const secondPayload: RegistrationProjectData = {
      name: 'Second Proj',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      products: [],
    }

    comp.successProjectSubmit(firstPayload as never)
    expect(comp.project.name).toBe('First Proj')
    expect(comp.createVisible.value).toBe(true)

    comp.createVisible.value = false
    comp.successProjectSubmit(secondPayload as never)
    expect(comp.project.name).toBe('Second Proj')
    expect(comp.createVisible.value).toBe(true)
  })
})
