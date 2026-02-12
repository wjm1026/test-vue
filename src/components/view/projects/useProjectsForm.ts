import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute } from 'vue-router'

import { pattern, DateRangeStatus, DATE_FORMAT_YYYY_MM_DD } from '@/enum'
import message from '@/enum/message.json'
import type {
  ProjectType,
  RegistrationProjectData,
  RegistrationProjectRequestBody,
} from '@/api/types/projects'
import type { Product } from '@/api/types/products'
import {
  addDays,
  formatDate,
  isBeforeDay,
  getDateRangeStatus,
  subtractDays,
} from '@/util/date-format'
import { useProjectDetailApi } from '@/hooks/useProjectDetailApi'
import { useProjectApi } from '@/hooks/useProjectApi'

type ProjectFormType = Omit<
  ProjectType,
  'point' | 'method' | 'purchaseStartDate' | 'purchaseEndDate' | 'publishEndDate'
> & {
  janCodes: string[]
  point?: number
  priorityFlag?: number
  priority?: number
}

export const useProjectsForm = (
  emit: (event: 'successProjectSubmit', project: RegistrationProjectData) => void,
) => {
  const route = useRoute()

  const projectId = computed(() => (route.params.id ? Number(route.params.id) : undefined))

  const { projectDetail } = useProjectDetailApi(projectId)

  const projectsForm = reactive<ProjectFormType>({
    name: '',
    startDate: '',
    endDate: '',
    janCodes: [],
    point: 0,
    priorityFlag: 0,
    priority: undefined,
  })

  const productVisible = ref(false)
  const targetProduct = ref<Product[]>([])
  const janCode = ref('')
  const projectsFormRef = ref<FormInstance>()
  const measureRef = ref<HTMLElement | null>(null)
  const unitLeft = ref(0)
  const showDateWarning = ref(false)

  const validateProduct = (
    rule: unknown,
    value: unknown,
    callback: (error?: string | Error) => void,
  ) => {
    if (!targetProduct.value.length) {
      callback(new Error(''))
      return
    }
    callback()
  }

  const projectsFormRules = ref<FormRules>({
    name: [
      { required: true, message: message.project.nameRequired, trigger: 'blur' },
      {
        min: 1,
        max: 100,
        message: message.project.namePattern,
        trigger: ['blur', 'change'],
      },
    ],
    dateRange: {
      validator: (_, __, callback) => {
        if (!projectsForm.startDate) {
          callback(message.project.validateDate)
          return
        }
        if (!projectsForm.endDate) {
          callback(message.project.validateEndDate)
          return
        }
        callback()
      },
      trigger: ['blur', 'change'],
    },
    targetProduct: [
      {
        required: true,
        validator: validateProduct,
        message: message.project.targetProductRequired,
      },
    ],
    point: [
      { required: true, message: message.project.pointRequired, trigger: 'blur' },
      {
        validator: (_, value, callback) => {
          if (value > 99999) {
            callback(new Error(message.project.pointPattern))
            return
          }
          callback()
        },
        trigger: ['blur', 'change'],
      },
    ],
    priority: {
      validator: (_, value, callback) => {
        if (projectsForm.priorityFlag === 0) return callback()
        if (!value) {
          callback(new Error(message.project.priorityRequired))
          return
        }
        if (!pattern.priority.test(String(value))) {
          callback(new Error(message.project.priorityPattern))
          return
        }
        callback()
      },
      trigger: ['blur', 'change'],
    },
  })
  const disabled = computed(
    () =>
      !projectsForm.name ||
      !projectsForm.startDate ||
      !projectsForm.point?.toString() ||
      !janCode.value ||
      (projectsForm.priorityFlag === 1 && !projectsForm.priority),
  )

  const projectStatus = computed(() =>
    getDateRangeStatus(projectsForm.startDate, projectsForm.endDate),
  )

  const isProjectEnded = computed(() => projectStatus.value === DateRangeStatus.Ended)
  const isProjectStarted = computed(() => {
    if (!projectId.value) return false
    return projectStatus.value !== DateRangeStatus.NotStarted
  })

  const { submitProject, isPending } = useProjectApi()

  const getProjectData = () => {
    if (!projectDetail?.value) return
    const { project, products } = projectDetail.value
    projectsForm.name = project?.name ?? ''
    projectsForm.startDate = project?.startDate ?? ''
    projectsForm.endDate = project?.endDate ?? ''
    projectsForm.point = project?.point ?? 0
    projectsForm.priorityFlag = project?.priorityFlag ?? 0
    projectsForm.priority = project?.priority ?? undefined
    projectsForm.janCodes = products?.map((item) => item.janCode) ?? []
    janCode.value = projectsForm.janCodes[0] ?? ''
    targetProduct.value = products?.map((item) => ({
      productImageUrl: item?.imageUrl ?? '',
      productName: item?.productName ?? '',
      maker: item?.maker ?? '',
      janCode: item?.janCode ?? '',
      createdAt: item?.createdAt ?? '',
    }))
    handlePointInput(projectsForm.point.toString())
  }

  const disabledStartDate = (time: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // 開始日は明日以降を指定してください
    return isBeforeDay(time, addDays(today, 2))
  }

  const disabledEndDate = (time: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (isBeforeDay(time, addDays(today, 3))) return true

    const start = projectsForm.startDate
    if (!start) return false
    return isBeforeDay(time, addDays(start, 1))
  }

  const targetProductHandle = () => {
    productVisible.value = true
  }

  const purchaseStartDate = computed(() => {
    if (!projectsForm.startDate) return ''

    return subtractDays(projectsForm.startDate, 30)
  })

  const purchaseEndDate = computed(() => {
    if (!projectsForm.endDate) return ''

    return subtractDays(projectsForm.endDate, 2)
  })

  const purchaseDateRange = computed(() => {
    if (!purchaseStartDate.value && !purchaseEndDate.value) return ''
    return `${formatDate(purchaseStartDate.value)} ~ ${formatDate(purchaseEndDate.value)}`
  })

  const publishEndDate = computed(() => {
    if (!projectsForm.endDate) return ''
    return addDays(projectsForm.endDate, 14)
  })

  const publishDateRange = computed(() => {
    if (!projectsForm.startDate && !publishEndDate.value) return ''
    return `${formatDate(projectsForm.startDate)} ~ ${formatDate(publishEndDate.value)}`
  })

  const createProjectSubmit = async () => {
    if (!projectsFormRef.value) return
    await projectsFormRef.value.validate()
    const currentProjectId = projectId.value
    projectsForm.priority = projectsForm?.priority ? Number(projectsForm.priority) : undefined

    const data: RegistrationProjectRequestBody = {
      ...(currentProjectId && { projectId: Number(currentProjectId) }),
      name: projectsForm?.name ?? '',
      startDate: projectsForm?.startDate
        ? formatDate(projectsForm.startDate, DATE_FORMAT_YYYY_MM_DD)
        : '',
      endDate: projectsForm?.endDate
        ? formatDate(projectsForm.endDate, DATE_FORMAT_YYYY_MM_DD)
        : '',
      // 一時固定パス00です
      method: '00',
      point: projectsForm?.point ? Number(projectsForm.point) : 0,
      janCodes: projectsForm?.janCodes ?? [],
      priorityFlag: projectsForm.priorityFlag ?? 0,
      priority: projectsForm.priority ?? undefined,
      purchaseStartDate: formatDate(purchaseStartDate.value, DATE_FORMAT_YYYY_MM_DD),
      purchaseEndDate: purchaseEndDate.value
        ? formatDate(purchaseEndDate.value, DATE_FORMAT_YYYY_MM_DD)
        : '',
      publishEndDate: publishEndDate.value
        ? formatDate(publishEndDate.value, DATE_FORMAT_YYYY_MM_DD)
        : '',
    }

    const res = await submitProject(data)
    emit('successProjectSubmit', res)
  }

  const chooseTargetProduct = (product: Product) => {
    targetProduct.value = [product]
    janCode.value = product.janCode
    projectsForm.janCodes = [product.janCode]
  }

  const closeTargetProduct = () => {
    productVisible.value = false
  }

  const deleteProductHandle = () => {
    if (isProjectStarted.value) return
    targetProduct.value = []
    janCode.value = ''
    projectsForm.janCodes = []
  }

  const handlePointInput = async (value: string) => {
    projectsForm.point = Number(value.replace(/\D/g, ''))
    await nextTick()
    if (measureRef.value) {
      unitLeft.value = measureRef.value.offsetWidth + 8
    }
  }

  watch(
    () => projectDetail.value,
    (detail) => {
      if (detail) {
        getProjectData()
      }
    },
    { immediate: true },
  )

  watch(
    () => projectsForm.startDate,
    (start) => {
      const end = projectsForm.endDate
      if (!start || (end && isBeforeDay(end, addDays(start, 1)))) {
        projectsForm.endDate = ''
      }
    },
  )

  watch(
    () => projectsForm.priorityFlag,
    (flag) => {
      if (flag === 0) {
        projectsForm.priority = undefined
      }
    },
  )

  watch(
    () => [projectsForm.startDate, projectsForm.endDate],
    ([startDate, endDate]) => {
      if (startDate && endDate && isBeforeDay(endDate, addDays(startDate, 8))) {
        showDateWarning.value = true
      } else {
        showDateWarning.value = false
      }
    },
  )

  return {
    projectsForm,
    projectsFormRef,
    projectsFormRules,
    disabled,
    productVisible,
    targetProduct,
    janCode,
    measureRef,
    unitLeft,
    showDateWarning,
    isPending,
    isProjectEnded,
    isProjectStarted,
    purchaseDateRange,
    publishDateRange,
    getProjectData,
    targetProductHandle,
    createProjectSubmit,
    closeTargetProduct,
    chooseTargetProduct,
    deleteProductHandle,
    disabledStartDate,
    disabledEndDate,
    handlePointInput,
  }
}
