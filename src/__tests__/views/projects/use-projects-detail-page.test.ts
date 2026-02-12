import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref, type Ref } from 'vue'

import { SortOrder } from '@/enum'

type Module = typeof import('@/views/projects/detail/useProjectsDetailPage')

// Mocks
const pushMock = vi.fn().mockResolvedValue(undefined)
vi.mock('@/router', () => ({
  default: { push: pushMock },
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '42' } }),
  useRouter: () => ({ push: pushMock }),
}))

let projectDetailRef: Ref<unknown>
const isLoadingRef = ref(false)
vi.mock('@/hooks/useProjectDetailApi', () => ({
  useProjectDetailApi: () => ({ isLoading: isLoadingRef, projectDetail: projectDetailRef }),
}))

const deleteProjectMutateAsyncMock = vi.fn()
const isDeleteLoadingRef = ref(false)
vi.mock('@/hooks/useProjectDeleteApi', () => ({
  useProjectDeleteApi: () => ({
    deleteProjectMutateAsync: deleteProjectMutateAsyncMock,
    isDeleteLoading: isDeleteLoadingRef,
  }),
}))

const successMock = vi.fn()
const errorMock = vi.fn()
vi.mock('element-plus', () => ({
  ElMessage: { success: successMock, error: errorMock },
}))

async function createComposable(detailData?: unknown) {
  vi.resetModules()
  pushMock.mockReset().mockResolvedValue(undefined)
  successMock.mockReset()
  errorMock.mockReset()
  deleteProjectMutateAsyncMock.mockReset()
  projectDetailRef = ref(detailData)
  const module = (await import(
    '@/views/projects/detail/useProjectsDetailPage'
  )) as unknown as Module
  return module.useProjectsDetailPage()
}

describe('useProjectsDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with route id and default values; title formats without name', async () => {
    const comp = await createComposable(undefined)
    expect(comp.title.value).toBe('（ID : 42）')
    expect(comp.projects.value.id).toBe(42)
    expect(Array.isArray(comp.targetProductData.value)).toBe(true)
    expect(comp.sortField.value).toBe('')
    expect(comp.sortOrder.value).toBe(SortOrder.Asc)
    expect(comp.isLoading.value).toBe(false)
  })

  it('hydrates project and products from detail data and updates title', async () => {
    const comp = await createComposable({
      project: {
        id: 42,
        name: 'My Project',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        method: 'NCライト',
        point: 10,
      },
      products: [
        {
          imageUrl: 'img.jpg',
          productName: 'P1',
          maker: 'M1',
          janCode: '111',
          createdAt: '2025-01-01T00:00:00Z',
        },
      ],
    })

    // immediate watcher should set values
    expect(comp.title.value).toBe('My Project（ID : 42）')
    expect(comp.projects.value.name).toBe('My Project')
    expect(comp.targetProductData.value[0]?.productName).toBe('P1')
  })

  it('updateHandle routes to create page with id', async () => {
    const comp = await createComposable({ project: { id: 42, name: '' } })
    comp.updateHandle()
    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({ name: expect.any(String), params: { id: 42 } })
  })

  it('deleteHandle shows success message and routes on success', async () => {
    const comp = await createComposable()
    deleteProjectMutateAsyncMock.mockResolvedValue({ resultCode: 1 })
    await comp.deleteHandle()
    expect(successMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('deleteHandle suppresses navigation when API returns error', async () => {
    const comp = await createComposable()
    deleteProjectMutateAsyncMock.mockRejectedValue(new Error('NG'))
    await expect(comp.deleteHandle()).rejects.toThrow('NG')
    expect(errorMock).not.toHaveBeenCalled()
    // no navigation on error
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('deleteHandle does not navigate when resultCode is not Success', async () => {
    // Purpose: verify navigation only occurs on successful deletion.
    const comp = await createComposable()
    deleteProjectMutateAsyncMock.mockResolvedValue({ resultCode: 9 })
    await comp.deleteHandle()
    expect(successMock).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('reportHandle navigates to reports detail page with project id', async () => {
    // Purpose: ensure report button routes to correct report detail page.
    const comp = await createComposable()
    comp.reportHandle()
    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({
      name: expect.any(String),
      params: { id: 42 },
    })
  })

  it('isEmpty returns true when not loading and no project detail', async () => {
    // Purpose: verify empty state detection logic.
    const comp = await createComposable(undefined)
    isLoadingRef.value = false
    expect(comp.isEmpty.value).toBe(true)
  })

  it('isEmpty returns false when loading', async () => {
    // Purpose: ensure loading state prevents empty state.
    const comp = await createComposable(undefined)
    isLoadingRef.value = true
    expect(comp.isEmpty.value).toBe(false)
  })

  it('isEmpty returns false when project detail exists', async () => {
    // Purpose: verify project detail prevents empty state.
    const comp = await createComposable({
      project: { id: 42, name: 'Test' },
      products: [],
    })
    isLoadingRef.value = false
    expect(comp.isEmpty.value).toBe(false)
  })

  it('updates sort field and sort order', async () => {
    // Purpose: ensure sorting state can be updated.
    const comp = await createComposable()
    comp.sortField.value = 'productName'
    comp.sortOrder.value = SortOrder.Desc
    expect(comp.sortField.value).toBe('productName')
    expect(comp.sortOrder.value).toBe(SortOrder.Desc)
  })
})
