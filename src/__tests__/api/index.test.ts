import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { SortOrder, pageSize } from '@/enum'

const listRequestSpy = vi.fn()
const detailRequestSpy = vi.fn()
const registrationRequestSpy = vi.fn()
const deleteRequestSpy = vi.fn()

const createApiRequestMock: Mock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('Unexpected call order')
  }),
)

const toCamelCaseKeysMock = vi.hoisted(() => vi.fn((value) => ({ __converted: value })))

const createListMockHandlerMock = vi.hoisted(() => vi.fn(() => Symbol('list-handler')))

vi.mock('@/api/request', () => ({
  createApiRequest: createApiRequestMock,
}))

vi.mock('@/util/camel-case', () => ({
  toCamelCaseKeys: toCamelCaseKeysMock,
}))

vi.mock('@/mocks/processors/mocksHandler', () => ({
  createListMockHandler: createListMockHandlerMock,
}))

describe('api/index', () => {
  beforeEach(() => {
    vi.resetModules()
    listRequestSpy.mockReset().mockResolvedValue('list-response')
    detailRequestSpy.mockReset().mockResolvedValue('detail-response')
    registrationRequestSpy.mockReset().mockResolvedValue('registration-response')
    deleteRequestSpy.mockReset().mockResolvedValue('delete-response')
    createApiRequestMock.mockReset()
    createListMockHandlerMock.mockClear()
    toCamelCaseKeysMock.mockClear()

    createApiRequestMock
      .mockImplementationOnce(() => listRequestSpy)
      .mockImplementationOnce(() => detailRequestSpy)
      .mockImplementationOnce(() => registrationRequestSpy)
      .mockImplementationOnce(() => deleteRequestSpy)
  })

  it('initializes project API requests with camelized fixtures and list handler', async () => {
    const module = await import('@/api/index')

    const projectListJson = (await import('@/mocks/data/project/projectList.json')).default
    const projectDetailJson = (await import('@/mocks/data/project/projectDetail.json')).default
    const projectRegistrationJson = (await import('@/mocks/data/project/projectRegistration.json'))
      .default
    const projectJson = (await import('@/mocks/data/project/project.json')).default

    expect(toCamelCaseKeysMock).toHaveBeenCalledTimes(4)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(projectListJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(projectDetailJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(projectRegistrationJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(projectJson)

    expect(createListMockHandlerMock).toHaveBeenCalledWith(
      ['projectName', 'productName'],
      'total',
      'projects',
    )
    const listHandler = createListMockHandlerMock.mock.results[0]?.value
    const [listDataArg, listHandlerArg] = createApiRequestMock.mock.calls[0] ?? []
    expect(listDataArg).toEqual({ __converted: projectListJson })
    expect(listHandlerArg).toBe(listHandler)

    expect(createApiRequestMock).toHaveBeenNthCalledWith(2, { __converted: projectDetailJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(3, {
      __converted: projectRegistrationJson,
    })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(4, { __converted: projectJson })

    // Ensure exports exist to avoid tree-shake elimination during test.
    expect(module.getProjectList).toBeTypeOf('function')
    expect(module.getProjectDetail).toBeTypeOf('function')
    expect(module.registrationProject).toBeTypeOf('function')
    expect(module.deleteProject).toBeTypeOf('function')
  })

  it('delegates project list/detail mutations to their respective request factories', async () => {
    const { getProjectList, getProjectDetail, registrationProject, deleteProject } = await import(
      '@/api/index'
    )

    const listParams = {
      query: 'alpha',
      offset: 20,
      sortKey: 'projectName',
      sortOrder: SortOrder.Desc,
    } as const

    const listResult = await getProjectList(listParams)
    expect(listResult).toBe('list-response')
    expect(listRequestSpy).toHaveBeenCalledWith({
      url: '/project-list',
      method: 'GET',
      params: {
        limit: pageSize,
        ...listParams,
      },
    })

    const detailResult = await getProjectDetail({ projectId: 42 })
    expect(detailResult).toBe('detail-response')
    expect(detailRequestSpy).toHaveBeenCalledWith({
      url: '/project-detail',
      method: 'GET',
      params: { projectId: 42 },
    })

    const registrationPayload = { projectName: 'New Project' }
    const registrationResult = await registrationProject(registrationPayload as never)
    expect(registrationResult).toBe('registration-response')
    expect(registrationRequestSpy).toHaveBeenCalledWith({
      url: '/project',
      method: 'POST',
      data: registrationPayload,
    })

    const deleteResult = await deleteProject(12345)
    expect(deleteResult).toBe('delete-response')
    expect(deleteRequestSpy).toHaveBeenCalledWith({
      url: '/project/12345',
      method: 'DELETE',
    })
  })
})
