// generated-by: ai-assist v1.0
// type: unit
// description: Tests App.vue RouterView integration: renders current route, handles unmatched routes, and errors without a router.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { defineComponent, h } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'

import App from '@/App.vue'

// Helper to create a simple in-memory router with two routes
function makeTestRouter() {
  const Home = defineComponent({ name: 'HomePage', setup: () => () => h('div', 'Home Page') })
  const About = defineComponent({ name: 'AboutPage', setup: () => () => h('div', 'About Page') })

  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: About },
    ],
  })
}

describe('App.vue', () => {
  it('renders the active route component via RouterView', async () => {
    const router = makeTestRouter()
    const pinia = createPinia()
    // Start at /about and ensure About Page is rendered
    router.push('/about')
    await router.isReady()

    render(App, { global: { plugins: [router, pinia] } })
    expect(screen.getByText('About Page')).toBeInTheDocument()

    // Navigate to / and ensure Home Page is rendered
    await router.push('/')
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('renders nothing for unmatched routes', async () => {
    const router = makeTestRouter()
    const pinia = createPinia()
    // Push an unmatched route so RouterView has no content
    router.push('/not-found')
    await router.isReady()

    // Silence expected router warning for unmatched route to keep test output clean
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { queryByText, container } = render(App, { global: { plugins: [router, pinia] } })
    expect(queryByText('Home Page')).toBeNull()
    expect(queryByText('About Page')).toBeNull()
    // In absence of a matched route, RouterView renders no text content
    expect(container.textContent).toBe('')

    warnSpy.mockRestore()
  })

  it('warns and renders nothing without installing the router', () => {
    const pinia = createPinia()
    // Rendering App without the router plugin does not throw, but Vue warns
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { container } = render(App, { global: { plugins: [pinia] } })

    // RouterView is unresolved without the router plugin; Vue logs a warning
    const warned =
      warnSpy.mock.calls.flat().join(' ').includes('Failed to resolve component: RouterView') ||
      errorSpy.mock.calls.flat().join(' ').includes('Failed to resolve component: RouterView')
    expect(warned).toBe(true)
    // Nothing is rendered because the router-view cannot resolve
    expect(container.textContent).toBe('')

    warnSpy.mockRestore()
    errorSpy.mockRestore()
  })
})
