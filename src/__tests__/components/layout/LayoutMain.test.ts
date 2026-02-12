// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for LayoutMain.vue verifying title render, back navigation via router.go(-1), and pagination visibility and event wiring.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

// Hoisted router mock so factory can reference it safely
const mocked = vi.hoisted(() => ({
  goMock: vi.fn<(n: number) => void>(),
  routeMock: { path: '/' },
  createRouter: vi.fn(() => ({
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ go: mocked.goMock }),
    useRoute: () => mocked.routeMock,
    createRouter: mocked.createRouter,
    createWebHistory: mocked.createWebHistory,
  }
})

vi.mock('@/router', () => ({
  default: {
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
  },
}))

vi.mock('@/router/guards', () => ({
  setupRouterGuards: vi.fn(),
}))

import LayoutMain from '@/components/layout/LayoutMain.vue'

describe('LayoutMain.vue', () => {
  it('renders title and triggers router.go(-1) when back is clicked', async () => {
    mocked.goMock.mockReset()

    render(LayoutMain, {
      props: { title: 'ダッシュボード' },
      global: {
        // Minimal stubs for Element Plus bits used by this component
        stubs: {
          Sidebar: { template: '<aside />' },
          ElMain: { template: '<main><slot /></main>' },
          ElIcon: { template: '<i><slot /></i>' },
          ElText: { template: '<span><slot /></span>' },
          // Do not render pagination for this test
          ElPagination: false,
        },
      },
    })

    // Title renders
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()

    // Click on the back text area triggers router.go(-1)
    await userEvent.click(screen.getByText('戻る'))
    expect(mocked.goMock).toHaveBeenCalledWith(-1)
  })

  it('does not render pagination when showPagination is false', () => {
    const { queryByTestId } = render(LayoutMain, {
      props: { title: 'タイトル', showPagination: false },
      global: {
        stubs: {
          Sidebar: { template: '<aside />' },
          ElMain: { template: '<main><slot /></main>' },
          ElIcon: { template: '<i><slot /></i>' },
          ElText: { template: '<span><slot /></span>' },
          ElPagination: { template: '<div data-testid="pagi" />' },
        },
      },
    })

    expect(queryByTestId('pagi')).toBeNull()
  })

  it('renders pagination when enabled and emits pageChange on current-change', async () => {
    const { emitted } = render(LayoutMain, {
      props: { title: '一覧', showPagination: true, total: 42, page: 1 },
      global: {
        stubs: {
          Sidebar: { template: '<aside />' },
          ElMain: { template: '<main><slot /></main>' },
          ElIcon: { template: '<i><slot /></i>' },
          ElText: { template: '<span><slot /></span>' },
          // Custom pagination stub that can emit current-change
          ElPagination: {
            props: ['total', 'currentPage'],
            template:
              '<div data-testid="pagi">' +
              '<button data-testid="go-2" @click="$emit(\'current-change\', 2)">go2</button>' +
              '</div>',
          },
        },
      },
    })

    await userEvent.click(screen.getByTestId('go-2'))
    expect(emitted().pageChange).toBeTruthy()
    expect(emitted().pageChange[0]).toEqual([2])
  })
})
