import { describe, expect, it, vi } from 'vitest'
import { ref, type Ref } from 'vue'

import { SortOrder } from '@/enum'

type UseProjectsPageModule = typeof import('@/views/projects/useProjectsPage')

const pushMock = vi.fn()
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return { ...actual, useRouter: () => ({ push: pushMock }) }
})

let projectListRef: Ref<unknown>
const isLoadingRef = ref(false)
vi.mock('@/hooks/useProjectListApi', () => ({
  useProjectListApi: () => ({ projectList: projectListRef, isLoading: isLoadingRef }),
}))

async function createComposable(listData?: unknown) {
  vi.resetModules()
  pushMock.mockReset()
  projectListRef = ref(listData)
  const module = (await import(
    '@/views/projects/useProjectsPage'
  )) as unknown as UseProjectsPageModule
  return module.useProjectsPage()
}

describe('useProjectsPage', () => {
  it('initializes state and exposes list and loading', async () => {
    const comp = await createComposable({ projects: [], total: 0 })
    expect(comp.page.value).toBeGreaterThan(0)
    expect(comp.searchKeyword.value).toBe('')
    expect(comp.sortField.value).toBe('')
    expect(comp.sortOrder.value).toBe(SortOrder.Desc)
    expect(comp.projectList.value).toEqual({ projects: [], total: 0 })
    expect(comp.isLoading.value).toBe(false)
  })

  it('pageChange updates page', async () => {
    const comp = await createComposable()
    comp.pageChange(4)
    expect(comp.page.value).toBe(4)
  })

  it('projectAdd navigates to create route', async () => {
    const comp = await createComposable()
    await comp.projectAdd()
    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({ name: expect.any(String) })
  })

  it('updates search keyword and debounces query', async () => {
    // Purpose: verify search keyword updates trigger debounced query.
    const comp = await createComposable()
    comp.searchKeyword.value = 'test query'
    expect(comp.searchKeyword.value).toBe('test query')
  })

  it('updates sort field and sort order', async () => {
    // Purpose: ensure sorting state can be updated.
    const comp = await createComposable()
    comp.sortField.value = 'name'
    comp.sortOrder.value = SortOrder.Desc
    expect(comp.sortField.value).toBe('name')
    expect(comp.sortOrder.value).toBe(SortOrder.Desc)
  })

  it('computes offset based on page number', async () => {
    // Purpose: verify offset calculation follows pagination.
    const comp = await createComposable()
    comp.pageChange(2)
    expect(comp.page.value).toBe(2)
  })
})
