import { beforeEach, describe, expect, it, vi } from 'vitest'

const addProductMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/products', () => ({
  addProduct: addProductMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useProductApi', () => {
  beforeEach(() => {
    vi.resetModules()
    addProductMock.mockReset()
    useMutationMock.mockReset()
  })

  it('initializes mutation with addProduct API and returns submitProduct', async () => {
    const mutateAsyncSpy = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useProductApi } = await import('@/hooks/useProductApi')
    const { submitProduct, isPending } = useProductApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const args = useMutationMock.mock.calls[0]?.[0]
    expect(args).toEqual({ mutationFn: addProductMock })

    expect(submitProduct).toBe(mutateAsyncSpy)
    expect(isPending).toBe(false)
  })

  it('mirrors pending state from useMutation', async () => {
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useProductApi } = await import('@/hooks/useProductApi')
    const { isPending } = useProductApi()

    expect(isPending).toBe(true)
  })
})
