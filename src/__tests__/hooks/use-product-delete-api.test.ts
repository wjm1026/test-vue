// generated-by: ai-assist v1.0
// type: unit
// description: useProductDeleteApi test verifying mutation wiring and exposed refs.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useMutationMock = vi.hoisted(() => vi.fn())
const deleteProductMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

vi.mock('@/api/products', () => ({
  deleteProduct: deleteProductMock,
}))

describe('useProductDeleteApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useMutationMock.mockReset()
    deleteProductMock.mockReset()
  })

  it('returns mutation helpers linked to deleteProduct API', async () => {
    const mutateAsyncMock = vi.fn()
    const loadingRef = ref(false)
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: loadingRef,
    })

    const module = await import('@/hooks/useProductDeleteApi')
    const result = module.useProductDeleteApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const options = useMutationMock.mock.calls[0]?.[0]
    expect(options?.mutationFn).toBe(deleteProductMock)

    await result.deleteProductMutateAsync(1)
    expect(mutateAsyncMock).toHaveBeenCalledWith(1)
    expect(result.isDeleteLoading).toBe(loadingRef)
  })
})
