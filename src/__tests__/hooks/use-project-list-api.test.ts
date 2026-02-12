import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { SortOrder } from '@/enum'

const useQueryMock = vi.hoisted(() => vi.fn())
const getProjectListMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api', () => ({
  getProjectList: getProjectListMock,
}))

describe('useProjectListApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getProjectListMock.mockReset()
  })

  it('initializes useQuery with reactive params and calls getProjectList', async () => {
    const dataRef = ref({ code: 200 })
    let capturedOptions: {
      queryKey: unknown[]
      queryFn: () => Promise<unknown>
      placeholderData: (prev: unknown) => unknown
    } | null = null

    useQueryMock.mockImplementation((options) => {
      capturedOptions = options
      return {
        data: dataRef,
        isFetching: false,
      }
    })

    const offset = ref(5)
    const query = ref('energy')
    const sortKey = ref('project_name')
    const sortOrder = ref(SortOrder.Desc)
    const page = ref(3)
    const resultPayload = { data: { projects: [] } }
    getProjectListMock.mockResolvedValue(resultPayload)

    const { useProjectListApi } = await import('@/hooks/useProjectListApi')
    const { projectList, isLoading } = useProjectListApi(
      { offset, query, sortKey, sortOrder },
      page,
    )

    expect(projectList).toBe(dataRef)
    expect(isLoading).toBe(false)
    expect(useQueryMock).toHaveBeenCalledTimes(1)
    expect(capturedOptions!.queryKey).toEqual(['projectList', offset, query, sortKey, sortOrder])
    expect(capturedOptions!.placeholderData?.('prev')).toBe('prev')

    await capturedOptions!.queryFn()
    expect(getProjectListMock).toHaveBeenCalledTimes(1)
    expect(getProjectListMock).toHaveBeenCalledWith({
      offset: 5,
      query: 'energy',
      sortKey: 'project_name',
      sortOrder: SortOrder.Desc,
    })
  })

  it('resets page to 1 when query or sorting changes', async () => {
    useQueryMock.mockReturnValue({
      data: ref(null),
      isFetching: true,
    })

    const offset = ref(0)
    const query = ref('')
    const sortKey = ref('project_name')
    const sortOrder = ref(SortOrder.Asc)
    const page = ref(4)

    const { useProjectListApi } = await import('@/hooks/useProjectListApi')
    useProjectListApi({ offset, query, sortKey, sortOrder }, page)

    query.value = 'new'
    await nextTick()
    expect(page.value).toBe(1)

    page.value = 3
    sortKey.value = 'maker'
    await nextTick()
    expect(page.value).toBe(1)

    page.value = 2
    sortOrder.value = SortOrder.Desc
    await nextTick()
    expect(page.value).toBe(1)
  })
})
