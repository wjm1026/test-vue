// Extend Vitest expect with @testing-library/jest-dom matchers
// and ensure DOM-related assertions are available globally.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/vue'
import { afterEach, vi } from 'vitest'

// Mock requestAnimationFrame for Vue transitions
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0)
}

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}

// Ensure a clean DOM between tests
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  vi.useRealTimers()
})
