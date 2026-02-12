// generated-by: ai-assist v1.0
// type: unit
// description: Tests for useCreateAccountDialog composable covering computed visibility state, navigation behavior, and event triggering.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'

import { routePaths } from '@/router/paths'
import type { AccountCreatedData } from '@/components/view/accounts/useCreateAccountDialog'

const pushMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

const createEmit = () => {
  const mock = vi.fn()
  const emit = (event: 'closeDialog') => mock(event)
  return { emit, mock }
}

describe('useCreateAccountDialog', () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it('derives visible state from props modelValue', async () => {
    const account: AccountCreatedData = {
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleDisplayName: '管理者',
    }
    const props = reactive({
      modelValue: true,
      account,
    })
    const { emit } = createEmit()

    const module = await import('@/components/view/accounts/useCreateAccountDialog')
    const { accountVisible } = module.useCreateAccountDialog(props, emit)

    expect(accountVisible.value).toBe(true)

    props.modelValue = false
    await nextTick()
    expect(accountVisible.value).toBe(false)
  })

  it('emits closeDialog and navigates to accounts root when accountVisible is set to false', async () => {
    const account: AccountCreatedData = {
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleDisplayName: '管理者',
    }
    const props = reactive({
      modelValue: true,
      account,
    })
    const { emit, mock } = createEmit()

    const module = await import('@/components/view/accounts/useCreateAccountDialog')
    const { accountVisible } = module.useCreateAccountDialog(props, emit)

    accountVisible.value = false

    expect(mock).toHaveBeenCalledWith('closeDialog')
    expect(pushMock).toHaveBeenCalledWith(routePaths.accounts.root)
  })

  it('does not emit or navigate when accountVisible is set to true', async () => {
    const account: AccountCreatedData = {
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleDisplayName: '管理者',
    }
    const props = reactive({
      modelValue: false,
      account,
    })
    const { emit, mock } = createEmit()

    const module = await import('@/components/view/accounts/useCreateAccountDialog')
    const { accountVisible } = module.useCreateAccountDialog(props, emit)

    accountVisible.value = true

    expect(mock).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('closeAccountDialog triggers emit and navigation', async () => {
    const account: AccountCreatedData = {
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleDisplayName: '管理者',
    }
    const props = reactive({
      modelValue: true,
      account,
    })
    const { emit, mock } = createEmit()

    const module = await import('@/components/view/accounts/useCreateAccountDialog')
    const { accountVisible, closeAccountDialog } = module.useCreateAccountDialog(props, emit)

    expect(accountVisible.value).toBe(true)

    closeAccountDialog()

    expect(mock).toHaveBeenCalledWith('closeDialog')
    expect(pushMock).toHaveBeenCalledWith(routePaths.accounts.root)
  })

  it('handles multiple close operations correctly', async () => {
    const account: AccountCreatedData = {
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleDisplayName: '管理者',
    }
    const props = reactive({
      modelValue: true,
      account,
    })
    const { emit, mock } = createEmit()

    const module = await import('@/components/view/accounts/useCreateAccountDialog')
    const { accountVisible, closeAccountDialog } = module.useCreateAccountDialog(props, emit)

    closeAccountDialog()
    expect(mock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledTimes(1)

    // Setting to false again should still emit and navigate
    accountVisible.value = false
    expect(mock).toHaveBeenCalledTimes(2)
    expect(pushMock).toHaveBeenCalledTimes(2)
  })
})
