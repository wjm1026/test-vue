import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useQueryMock = vi.hoisted(() => vi.fn())
const getProjectDetailMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/index', () => ({
  getProjectDetail: getProjectDetailMock,
}))

describe('useProjectDetailApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getProjectDetailMock.mockReset()
  })

  it('initializes useQuery for the provided projectId and exposes result bindings', async () => {
    const projectDetailRef = ref({ code: 200 })
    const refetchSpy = vi.fn()
    let capturedOptions: {
      queryKey: unknown[]
      queryFn: () => Promise<unknown>
      placeholderData: (prev: unknown) => unknown
    } | null = null

    useQueryMock.mockImplementation((options) => {
      capturedOptions = options
      return {
        data: projectDetailRef,
        isLoading: false,
        refetch: refetchSpy,
      }
    })

    const projectId = ref(42)
    const { useProjectDetailApi } = await import('@/hooks/useProjectDetailApi')
    const { projectDetail, isLoading, refetchProjectDetail } = useProjectDetailApi(projectId)

    expect(projectDetail).toBe(projectDetailRef)
    expect(isLoading).toBe(false)
    expect(refetchProjectDetail).toBe(refetchSpy)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    expect(capturedOptions!.queryKey).toEqual(['projectDetail', projectId])
    expect(capturedOptions!.placeholderData?.('previous')).toBe('previous')

    getProjectDetailMock.mockResolvedValueOnce({ project: { id: projectId }, products: [] })
    await capturedOptions!.queryFn()

    expect(getProjectDetailMock).toHaveBeenCalledTimes(1)
    expect(getProjectDetailMock).toHaveBeenCalledWith({ projectId: projectId.value })
  })
})
