import { createApiRequest } from './request'

import { createListMockHandler } from '@/mocks/processors/mocksHandler'
import type {
  ProjectsResponse,
  Project,
  ProjectsDetailResponse,
  ProjectRegistrationResponse,
  RegistrationProjectRequestBody,
  ProjectDeleteResponse,
} from '@/api/types/projects'
import { SortOrder, pageSize } from '@/enum'
import projectList from '@/mocks/data/project/projectList.json'
import projectDetail from '@/mocks/data/project/projectDetail.json'
import projectRegistration from '@/mocks/data/project/projectRegistration.json'
import project from '@/mocks/data/project/project.json'
import { toCamelCaseKeys } from '@/util/camel-case'

const requestProjectList = createApiRequest<ProjectsResponse>(
  toCamelCaseKeys(projectList),
  createListMockHandler<Project, ProjectsResponse, 'total', 'projects'>(
    ['projectName', 'productName'],
    'total',
    'projects',
  ),
)

const requestProjectDetail = createApiRequest<ProjectsDetailResponse>(
  toCamelCaseKeys(projectDetail),
)

const requestProject = createApiRequest<ProjectRegistrationResponse>(
  toCamelCaseKeys(projectRegistration),
)

const requestDelete = createApiRequest<ProjectDeleteResponse>(toCamelCaseKeys(project))

const mapSortKeyToApiFormat = (sortKey?: string): string | undefined => {
  if (!sortKey) return undefined
  if (sortKey === 'startDate') return 'period'
  return sortKey
}

export const getProjectList = (params?: {
  query: string
  offset: number
  limit?: number
  sortKey: string
  sortOrder: SortOrder
}) =>
  requestProjectList({
    url: '/project-list',
    method: 'GET',
    params: {
      limit: pageSize,
      ...params,
      sortKey: mapSortKeyToApiFormat(params?.sortKey),
    },
  })

export const getProjectDetail = (params: { projectId: number }) =>
  requestProjectDetail({
    url: '/project-detail',
    method: 'GET',
    params,
  })

export const registrationProject = (data: RegistrationProjectRequestBody) =>
  requestProject({
    url: '/project',
    method: 'POST',
    data,
  })

export const deleteProject = (projectId: number) =>
  requestDelete({
    url: `/project/${projectId}`,
    method: 'DELETE',
  })
