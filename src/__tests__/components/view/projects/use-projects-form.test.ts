import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref, type Ref } from 'vue'

// Mocks for dependent hooks
const submitProjectMock = vi.fn()
const isPendingMock = ref(false)
let projectDetailRef: Ref<unknown>
const refetchProjectDetailMock = vi.fn()

const useRouteMock = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => useRouteMock(),
}))

vi.mock('@/hooks/useProjectApi', () => ({
  useProjectApi: () => ({
    submitProject: submitProjectMock,
    isPending: isPendingMock,
  }),
}))

vi.mock('@/hooks/useProjectDetailApi', () => ({
  useProjectDetailApi: () => ({
    projectDetail: projectDetailRef,
    isLoading: ref(false),
    refetchProjectDetail: refetchProjectDetailMock,
  }),
}))

async function createComposable(options?: { projectId?: string; projectDetailData?: unknown }) {
  vi.resetModules()
  submitProjectMock.mockReset()
  refetchProjectDetailMock.mockReset()
  isPendingMock.value = false
  projectDetailRef = ref(options?.projectDetailData ?? undefined)
  useRouteMock.mockReturnValue({
    params: options?.projectId ? { id: options.projectId } : {},
  })
  const module = await import('@/components/view/projects/useProjectsForm')
  const emit = vi.fn()
  const composable = module.useProjectsForm(emit)
  return { composable, emit }
}

describe('useProjectsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes state and rules; disabled is true by default', async () => {
    const { composable } = await createComposable()

    expect(composable.projectsForm.name).toBe('')
    expect(composable.projectsForm.startDate).toBe('')
    expect(composable.projectsForm.endDate).toBe('')
    // Implementation initializes point to 0 (number), not an empty string.
    expect(composable.projectsForm.point).toBe(0)
    expect(composable.projectsForm.priorityFlag).toBe(0)
    expect(composable.projectsForm.priority).toBeUndefined()
    expect(composable.janCode.value).toBe('')
    expect(composable.disabled.value).toBe(true)

    // rules exist and include custom validators
    const rules = composable.projectsFormRules.value as unknown as {
      name: unknown[]
      dateRange: { validator?: unknown }
      targetProduct: Array<{ validator?: unknown }>
      priority: { validator?: unknown }
    }
    expect(Array.isArray(rules.name)).toBe(true)
    expect(typeof rules.dateRange).toBe('object')
    expect(typeof rules.dateRange?.validator).toBe('function')
    expect(Array.isArray(rules.targetProduct)).toBe(true)
    expect(typeof rules.targetProduct?.[0]?.validator).toBe('function')
    expect(typeof rules.priority?.validator).toBe('function')
  }, 10000)

  it('toggles disabled based on required fields including janCode', async () => {
    const { composable } = await createComposable()

    expect(composable.disabled.value).toBe(true)

    composable.projectsForm.name = 'New Project'
    composable.projectsForm.startDate = '2025-01-10'
    composable.projectsForm.endDate = '2025-01-20'
    composable.projectsForm.point = 10
    composable.janCode.value = '1234567890123'

    expect(composable.disabled.value).toBe(false)

    // removing janCode should disable again
    composable.janCode.value = ''
    expect(composable.disabled.value).toBe(true)
  })

  it('disabledStartDate returns true for days before today+2 and false otherwise', async () => {
    const { composable } = await createComposable()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const twoDaysLater = new Date(today)
    twoDaysLater.setDate(twoDaysLater.getDate() + 2)

    const threeDaysLater = new Date(today)
    threeDaysLater.setDate(threeDaysLater.getDate() + 3)

    expect(composable.disabledStartDate(yesterday)).toBe(true)
    expect(composable.disabledStartDate(today)).toBe(true)
    expect(composable.disabledStartDate(twoDaysLater)).toBe(false)
    expect(composable.disabledStartDate(threeDaysLater)).toBe(false)
  })

  it('disabledEndDate returns true for days before today+3', async () => {
    const { composable } = await createComposable()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const threeDaysLater = new Date(today)
    threeDaysLater.setDate(threeDaysLater.getDate() + 3)

    expect(composable.disabledEndDate(yesterday)).toBe(true)
    expect(composable.disabledEndDate(today)).toBe(true)
    expect(composable.disabledEndDate(threeDaysLater)).toBe(false)
  })

  it('disabledEndDate returns true for days before start date + 1', async () => {
    const { composable } = await createComposable()

    const futureStart = new Date()
    futureStart.setDate(futureStart.getDate() + 10)
    const futureStartStr = `${futureStart.getFullYear()}-${String(futureStart.getMonth() + 1).padStart(2, '0')}-${String(futureStart.getDate()).padStart(2, '0')}`

    const beforeStart = new Date(futureStart)
    beforeStart.setDate(beforeStart.getDate() - 1)

    const onStart = new Date(futureStart)

    const oneDayAfterStart = new Date(futureStart)
    oneDayAfterStart.setDate(oneDayAfterStart.getDate() + 1)

    const twoDaysAfterStart = new Date(futureStart)
    twoDaysAfterStart.setDate(twoDaysAfterStart.getDate() + 2)

    composable.projectsForm.startDate = futureStartStr
    expect(composable.disabledEndDate(beforeStart)).toBe(true)
    expect(composable.disabledEndDate(onStart)).toBe(true)
    expect(composable.disabledEndDate(oneDayAfterStart)).toBe(false)
    expect(composable.disabledEndDate(twoDaysAfterStart)).toBe(false)
  })

  it('handlePointInput strips non-digits, sets point and unitLeft', async () => {
    const { composable } = await createComposable()

    // stub measureRef width
    composable.measureRef.value = { offsetWidth: 50 } as unknown as HTMLElement
    await composable.handlePointInput('1,234pt')
    expect(composable.projectsForm.point).toBe(1234)
    expect(composable.unitLeft.value).toBe(58) // 50 + 8
  })

  it('selects and clears target product correctly', async () => {
    const { composable } = await createComposable()

    composable.chooseTargetProduct({
      productImageUrl: '',
      productName: 'Chosen',
      maker: 'Maker',
      janCode: 'ABC123',
      createdAt: '2024-01-01T00:00:00Z',
    } as never)

    expect(composable.targetProduct.value.length).toBe(1)
    expect(composable.janCode.value).toBe('ABC123')
    expect(composable.projectsForm.janCodes).toEqual(['ABC123'])

    composable.deleteProductHandle()
    expect(composable.targetProduct.value.length).toBe(0)
    expect(composable.janCode.value).toBe('')
    expect(composable.projectsForm.janCodes).toEqual([])
  })

  it('opens and closes target product dialog', async () => {
    const { composable } = await createComposable()
    expect(composable.productVisible.value).toBe(false)
    composable.targetProductHandle()
    expect(composable.productVisible.value).toBe(true)
    composable.closeTargetProduct()
    expect(composable.productVisible.value).toBe(false)
  })

  it('watches startDate and clears endDate when start is empty or after end', async () => {
    const { composable } = await createComposable()
    composable.projectsForm.endDate = '2025-01-09'
    composable.projectsForm.startDate = '2025-01-10'
    await nextTick()
    expect(composable.projectsForm.endDate).toBe('')

    // when start cleared, endDate should be cleared too
    composable.projectsForm.endDate = '2025-01-20'
    composable.projectsForm.startDate = ''
    await nextTick()
    expect(composable.projectsForm.endDate).toBe('')
  })

  it('getProjectData populates form and products from projectDetail when projectId exists', async () => {
    const { composable } = await createComposable({
      projectId: '5',
      projectDetailData: {
        project: {
          name: 'Loaded Project',
          startDate: '2025-02-01',
          endDate: '2025-02-10',
          method: '00',
          point: 30,
        },
        products: [
          {
            imageUrl: 'img.jpg',
            productName: 'Loaded Product',
            maker: 'Maker Inc',
            janCode: '9999999999999',
            createdAt: '2025-01-01T00:00:00Z',
          },
        ],
      },
    })

    composable.getProjectData()
    expect(composable.projectsForm.name).toBe('Loaded Project')
    expect(composable.projectsForm.startDate).toBe('2025-02-01')
    expect(composable.projectsForm.endDate).toBe('2025-02-10')
    expect(composable.projectsForm.point).toBe(30)
    expect(composable.targetProduct.value[0]?.productName).toBe('Loaded Product')
    expect(composable.janCode.value).toBe('9999999999999')
    expect(composable.projectsForm.janCodes).toEqual(['9999999999999'])
  })

  it('createProjectSubmit validates and submits, then emits success', async () => {
    const { composable, emit } = await createComposable({ projectId: '7' })
    const validateMock = vi.fn().mockResolvedValue(true)
    composable.projectsFormRef.value = {
      validate: validateMock,
    } as never

    composable.projectsForm.name = 'S'
    composable.projectsForm.startDate = '2025-03-01'
    composable.projectsForm.endDate = '2025-03-15'
    composable.projectsForm.point = 45
    composable.projectsForm.janCodes = ['111']
    composable.janCode.value = '111'

    submitProjectMock.mockResolvedValue({ id: 1 })

    await composable.createProjectSubmit()

    expect(validateMock).toHaveBeenCalledTimes(1)
    expect(submitProjectMock).toHaveBeenCalledTimes(1)
    expect(submitProjectMock).toHaveBeenCalledWith({
      projectId: 7,
      name: 'S',
      startDate: '2025-03-01',
      endDate: '2025-03-15',
      method: '00',
      point: 45,
      janCodes: ['111'],
      priorityFlag: 0,
      priority: undefined,
      purchaseStartDate: '2025-01-30',
      purchaseEndDate: '2025-03-13',
      publishEndDate: '2025-03-29',
    })
    expect(emit).toHaveBeenCalledWith('successProjectSubmit', { id: 1 })
  })

  it('createProjectSubmit returns early when form ref is missing', async () => {
    const { composable } = await createComposable()
    composable.projectsFormRef.value = undefined as never
    await composable.createProjectSubmit()
    expect(submitProjectMock).not.toHaveBeenCalled()
  })

  it('initializes priorityFlag to 0 and priority to undefined', async () => {
    const { composable } = await createComposable()
    expect(composable.projectsForm.priorityFlag).toBe(0)
    expect(composable.projectsForm.priority).toBeUndefined()
  })

  it('watches priorityFlag and clears priority when flag is 0', async () => {
    const { composable } = await createComposable()
    composable.projectsForm.priorityFlag = 1
    composable.projectsForm.priority = 5
    await nextTick()
    expect(composable.projectsForm.priority).toBe(5)

    composable.projectsForm.priorityFlag = 0
    await nextTick()
    expect(composable.projectsForm.priority).toBeUndefined()
  })

  it('disabled is true when priorityFlag is 1 but priority is not set', async () => {
    const { composable } = await createComposable()
    composable.projectsForm.name = 'Test Project'
    composable.projectsForm.startDate = '2025-01-10'
    composable.projectsForm.endDate = '2025-01-20'
    composable.projectsForm.point = 10
    composable.janCode.value = '1234567890123'
    composable.projectsForm.priorityFlag = 1
    composable.projectsForm.priority = undefined

    expect(composable.disabled.value).toBe(true)

    composable.projectsForm.priority = 5
    expect(composable.disabled.value).toBe(false)
  })

  it('disabled is false when priorityFlag is 0 even if priority is not set', async () => {
    const { composable } = await createComposable()
    composable.projectsForm.name = 'Test Project'
    composable.projectsForm.startDate = '2025-01-10'
    composable.projectsForm.endDate = '2025-01-20'
    composable.projectsForm.point = 10
    composable.janCode.value = '1234567890123'
    composable.projectsForm.priorityFlag = 0
    composable.projectsForm.priority = undefined

    expect(composable.disabled.value).toBe(false)
  })

  it('createProjectSubmit includes priority when priorityFlag is 1', async () => {
    const { composable } = await createComposable({ projectId: '8' })
    const validateMock = vi.fn().mockResolvedValue(true)
    composable.projectsFormRef.value = {
      validate: validateMock,
    } as never

    composable.projectsForm.name = 'Priority Project'
    composable.projectsForm.startDate = '2025-03-01'
    composable.projectsForm.endDate = '2025-03-15'
    composable.projectsForm.point = 45
    composable.projectsForm.janCodes = ['111']
    composable.projectsForm.priorityFlag = 1
    composable.projectsForm.priority = 7
    composable.janCode.value = '111'

    submitProjectMock.mockResolvedValue({ id: 1 })

    await composable.createProjectSubmit()

    expect(submitProjectMock).toHaveBeenCalledWith({
      projectId: 8,
      name: 'Priority Project',
      startDate: '2025-03-01',
      endDate: '2025-03-15',
      method: '00',
      point: 45,
      janCodes: ['111'],
      priorityFlag: 1,
      priority: 7,
      purchaseStartDate: '2025-01-30',
      purchaseEndDate: '2025-03-13',
      publishEndDate: '2025-03-29',
    })
  })

  it('createProjectSubmit keeps priority value when priorityFlag is 0', async () => {
    const { composable } = await createComposable({ projectId: '9' })
    const validateMock = vi.fn().mockResolvedValue(true)
    composable.projectsFormRef.value = {
      validate: validateMock,
    } as never

    composable.projectsForm.name = 'No Priority Project'
    composable.projectsForm.startDate = '2025-03-01'
    composable.projectsForm.endDate = '2025-03-15'
    composable.projectsForm.point = 45
    composable.projectsForm.janCodes = ['111']
    composable.projectsForm.priorityFlag = 0
    composable.projectsForm.priority = 5
    composable.janCode.value = '111'

    submitProjectMock.mockResolvedValue({ id: 1 })

    await composable.createProjectSubmit()

    expect(submitProjectMock).toHaveBeenCalledWith({
      projectId: 9,
      name: 'No Priority Project',
      startDate: '2025-03-01',
      endDate: '2025-03-15',
      method: '00',
      point: 45,
      janCodes: ['111'],
      priorityFlag: 0,
      priority: 5,
      purchaseStartDate: '2025-01-30',
      purchaseEndDate: '2025-03-13',
      publishEndDate: '2025-03-29',
    })
  })

  it('getProjectData loads priorityFlag and priority from projectDetail', async () => {
    const { composable } = await createComposable({
      projectId: '10',
      projectDetailData: {
        project: {
          name: 'Priority Project',
          startDate: '2025-02-01',
          endDate: '2025-02-10',
          method: '00',
          point: 30,
          priorityFlag: 1,
          priority: 8,
        },
        products: [
          {
            imageUrl: 'img.jpg',
            productName: 'Product',
            maker: 'Maker',
            janCode: '9999999999999',
            createdAt: '2025-01-01T00:00:00Z',
          },
        ],
      },
    })

    composable.getProjectData()
    expect(composable.projectsForm.priorityFlag).toBe(1)
    expect(composable.projectsForm.priority).toBe(8)
  })

  it('priority validator passes when priorityFlag is 0', async () => {
    const { composable } = await createComposable()
    const rules = composable.projectsFormRules.value as unknown as {
      priority: {
        validator?: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
      }
    }

    composable.projectsForm.priorityFlag = 0
    composable.projectsForm.priority = undefined

    let callbackCalled = false
    let callbackError: Error | undefined

    rules.priority.validator?.({}, undefined, (error?: Error) => {
      callbackCalled = true
      callbackError = error
    })

    expect(callbackCalled).toBe(true)
    expect(callbackError).toBeUndefined()
  })

  it('priority validator fails when priorityFlag is 1 and value is empty', async () => {
    const { composable } = await createComposable()
    const rules = composable.projectsFormRules.value as unknown as {
      priority: {
        validator?: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
      }
    }

    composable.projectsForm.priorityFlag = 1

    let callbackCalled = false
    let callbackError: Error | undefined

    rules.priority.validator?.(
      {},
      undefined, // Empty value
      (error?: Error) => {
        callbackCalled = true
        callbackError = error
      },
    )

    expect(callbackCalled).toBe(true)
    expect(callbackError).toBeInstanceOf(Error)
    expect(callbackError?.message).toContain('優先順位は必須項目です')
  })

  it('priority validator fails when priorityFlag is 1 and value is invalid', async () => {
    const { composable } = await createComposable()
    const rules = composable.projectsFormRules.value as unknown as {
      priority: {
        validator?: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
      }
    }

    composable.projectsForm.priorityFlag = 1

    let callbackCalled = false
    let callbackError: Error | undefined

    rules.priority.validator?.(
      {},
      '15', // Invalid: out of range
      (error?: Error) => {
        callbackCalled = true
        callbackError = error
      },
    )

    expect(callbackCalled).toBe(true)
    expect(callbackError).toBeInstanceOf(Error)
    expect(callbackError?.message).toContain('優先順位は1～10の範囲で入力してください')
  })

  it('priority validator passes when priorityFlag is 1 and value is valid', async () => {
    const { composable } = await createComposable()
    const rules = composable.projectsFormRules.value as unknown as {
      priority: {
        validator?: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
      }
    }

    composable.projectsForm.priorityFlag = 1

    let callbackCalled = false
    let callbackError: Error | undefined

    rules.priority.validator?.(
      {},
      '5', // Valid: within range
      (error?: Error) => {
        callbackCalled = true
        callbackError = error
      },
    )

    expect(callbackCalled).toBe(true)
    expect(callbackError).toBeUndefined()
  })
})
