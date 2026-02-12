import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useProjectDetailApi } from '@/hooks/useProjectDetailApi'
import { SortOrder, ResultCodeEnum, DateRangeStatus } from '@/enum'
import type { ProjectDetailType } from '@/api/types/projects'
import type { Product } from '@/api/types/products'
import { routeNames, routePaths } from '@/router/routes'
import { useProjectDeleteApi } from '@/hooks/useProjectDeleteApi'
import message from '@/enum/message.json'
import { getDateRangeStatus } from '@/util/date-format'

export const useProjectsDetailPage = () => {
  const route = useRoute()
  const router = useRouter()

  const projectId = computed(() => Number(route.params.id as string))

  const { isLoading, projectDetail } = useProjectDetailApi(projectId)
  const { deleteProjectMutateAsync, isDeleteLoading } = useProjectDeleteApi()

  const isEmpty = computed(() => {
    return !isLoading.value && !projectDetail.value
  })

  const projects = ref<ProjectDetailType>({
    id: Number(projectId.value),
    name: '',
    startDate: '',
    endDate: '',
    method: '',
    point: 0,
    priorityFlag: 0,
    purchaseStartDate: '',
    purchaseEndDate: '',
    publishEndDate: '',
    reportId: null,
  })

  const canEditProject = computed(() => {
    return (
      getDateRangeStatus(projects.value.startDate, projects.value.endDate) !== DateRangeStatus.Ended
    )
  })

  const canDeleteProject = computed(() => {
    return (
      getDateRangeStatus(projects.value.startDate, projects.value.endDate) ===
      DateRangeStatus.NotStarted
    )
  })

  const targetProductData = ref<Product[]>([])
  const title = computed(() => {
    if (projectDetail.value?.project) {
      const { project } = projectDetail.value
      return `${project.name}（ID : ${projectId.value}）`
    }
    return `（ID : ${projectId.value}）`
  })

  watch(
    projectDetail,
    (data) => {
      if (data) {
        projects.value = data.project
        targetProductData.value =
          (data.products?.map((item) => ({
            productImageUrl: item.imageUrl,
            productName: item.productName,
            maker: item.maker,
            janCode: item.janCode,
            createdAt: item.createdAt,
          })) as Product[]) ?? []
      }
    },
    {
      immediate: true,
      deep: true,
    },
  )

  const sortField = ref('')
  const sortOrder = ref<SortOrder>(SortOrder.Asc)

  const reportHandle = () => {
    router.push({
      name: routeNames.reports.detail,
      params: {
        id: projectId.value,
      },
    })
  }

  const updateHandle = () => {
    if (projectId.value) {
      router.push({
        name: routeNames.projects.create,
        params: {
          id: projectId.value,
        },
      })
    }
  }

  const deleteHandle = async () => {
    const response = await deleteProjectMutateAsync(Number(projectId.value))
    if (response.resultCode === ResultCodeEnum.Success) {
      ElMessage.success(message.project.deleteSuccess)
      router.push(routePaths.projects.root)
    }
  }

  return {
    title,
    projectDetail,
    isLoading,
    isEmpty,
    projects,
    targetProductData,
    sortField,
    sortOrder,
    isDeleteLoading,
    canEditProject,
    canDeleteProject,
    reportHandle,
    updateHandle,
    deleteHandle,
  }
}
