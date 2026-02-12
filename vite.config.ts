import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv, type PluginOption } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import istanbul from 'vite-plugin-istanbul'

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const { VITE_PROXY_PATH, VITE_API_BASE_URL } = env

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      visualizer() as PluginOption,
      AutoImport({ resolvers: [ElementPlusResolver()] }),
      Components({ resolvers: [ElementPlusResolver()] }),
      istanbul({
        include: 'src/**/*',
        exclude: ['src/__tests__/**', 'src/e2e/**'],
        extension: ['.ts', '.vue'],
        cypress: false,
        requireEnv: false,
      }),
    ],
    server: {
      port: 8000,
      host: '0.0.0.0',
      open: true,
      proxy: {
        [VITE_PROXY_PATH]: {
          target: VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${VITE_PROXY_PATH}`), ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      environment: 'jsdom',
      css: true,
    },
  }
})
