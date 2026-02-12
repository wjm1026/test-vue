import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
import { routePaths } from '@/router/routes'
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
  REQUEST_TIMEOUT,
} from '@/enum/constants'
import messages from '@/enum/message.json'

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_PROXY_PATH
  : import.meta.env.VITE_API_BASE_URL

export const axiosInstance = axios.create({
  baseURL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
})

export type ExtendedAxiosRequestConfig = InternalAxiosRequestConfig & {
  skipAuthGuard?: boolean
}

axiosInstance.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig) => {
    if (config.skipAuthGuard) {
      delete config.skipAuthGuard
      return config
    }

    const authStore = useAuthStore()
    const isAuthenticated = await authStore.ensureAuth()
    if (!isAuthenticated) {
      authStore.clearAuth()
      router.push(routePaths.login)
      return Promise.reject(new Error('リフレッシュトークンが無効です'))
    }

    if (authStore.accessToken) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const { config, response } = error
    const status = response?.status
    const isNetworkError = error.code === 'ERR_NETWORK'
    const isTimeoutError = error.code === 'ECONNABORTED'
    const errorMessage =
      response?.data?.error_message ||
      response?.data?.message ||
      error.message ||
      DEFAULT_ERROR_MESSAGE

    error.message = errorMessage

    const authStore = useAuthStore()
    const errorStore = useErrorStore()

    if (
      status === HTTP_STATUS_UNAUTHORIZED &&
      config &&
      !config._retry &&
      config.url !== '/refresh' &&
      config.url !== '/login'
    ) {
      config._retry = true
      try {
        const newToken = await authStore.refreshOnce()
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(config)
      } catch (refreshError) {
        if (authStore.accessToken) {
          authStore.clearAuth()
          router.push(routePaths.login)
        }
        ElMessage.error(messages.login.tokenExpired)
        return Promise.reject(refreshError)
      }
    }

    if (config?.url === '/refresh') {
      return Promise.reject(error)
    }

    if ((status && status >= HTTP_STATUS_SERVER_ERROR) || isNetworkError) {
      errorStore.showError()
    } else if (isTimeoutError) {
      ElMessage.error(DEFAULT_ERROR_MESSAGE)
    } else if (errorMessage) {
      ElMessage.error(errorMessage)
    }

    return Promise.reject(error)
  },
)

interface ApiInstanceOptions extends AxiosRequestConfig {
  returnFullResponse?: boolean
}

export const apiInstance = <T>(
  config: AxiosRequestConfig,
  options?: ApiInstanceOptions,
): Promise<T> => {
  const source = axios.CancelToken.source()
  const { returnFullResponse, ...restOptions } = options || {}

  const promise = axiosInstance({
    ...config,
    ...restOptions,
    cancelToken: source.token,
  }).then((response) => {
    if (returnFullResponse) {
      return response as T
    }
    return response.data as T
  })

  // @ts-expect-error - Adding cancel method to Promise instance which is not in the type definition
  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}
