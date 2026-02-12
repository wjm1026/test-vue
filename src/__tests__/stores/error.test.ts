import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

describe('error store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('toggles error dialog visibility', async () => {
    const { useErrorStore } = await import('@/stores/error')
    const store = useErrorStore()

    expect(store.showErrorDialog).toBe(false)
    store.showError()
    expect(store.showErrorDialog).toBe(true)
    store.hideError()
    expect(store.showErrorDialog).toBe(false)
  })
})
