import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import piniaPersist from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import 'element-plus/es/components/message/style/css'
import '@/style/tailwindcss.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
})

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, {
  queryClient,
})

app.mount('#app')
