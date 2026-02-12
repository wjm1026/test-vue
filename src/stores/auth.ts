import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

import { UserRoleEnum } from '@/enum'
import { refreshToken } from '@/api/login'

interface AuthState {
  accessToken: string | null
  expiresAt: number | null
  role: UserRoleEnum
  companyName: string
  refreshPromise: Promise<string> | null
  isRefreshing: boolean
  hasLoginHistory: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    expiresAt: null,
    role: UserRoleEnum.RepresentativeAdmin,
    refreshPromise: null,
    companyName: '',
    isRefreshing: false,
    hasLoginHistory: false,
  }),

  actions: {
    setToken(token: string) {
      try {
        this.accessToken = token
        this.hasLoginHistory = true
        const decoded: { role: string[] } = jwtDecode(token)
        const raw = decoded.role?.[0]
        if (raw === 'represent') {
          this.role = UserRoleEnum.RepresentativeAdmin
        } else if (raw === 'admin') {
          this.role = UserRoleEnum.ManagementUser
        } else {
          this.role = UserRoleEnum.GeneralUser
        }
      } catch {
        this.clearAuth()
      }
    },
    setCompanyName(companyName: string) {
      this.companyName = companyName
    },
    isTokenValid(): boolean {
      if (!this.accessToken || !this.expiresAt) return false

      const buffer = 10 * 1000
      // 10 seconds early
      return Date.now() + buffer < this.expiresAt
    },
    setExpiresAt(expiresIn: number) {
      const current = Date.now()
      this.expiresAt = current + expiresIn * 1000
    },
    clearAuth() {
      this.accessToken = null
      this.expiresAt = null
      this.refreshPromise = null
      this.role = UserRoleEnum.RepresentativeAdmin
      this.companyName = ''
      this.hasLoginHistory = false
    },
    async refreshOnce(): Promise<string> {
      // If a refresh is already in progress, return the existing promise
      if (this.refreshPromise) {
        return this.refreshPromise
      }

      // Create a new refresh promise
      this.isRefreshing = true
      this.refreshPromise = (async () => {
        try {
          const response = await refreshToken()

          this.setToken(response.accessToken)
          this.setExpiresAt(response.expiresIn)

          return response.accessToken
        } finally {
          // Clear the promise after completion (success or failure)
          this.refreshPromise = null
          this.isRefreshing = false
        }
      })()

      return this.refreshPromise
    },
    async ensureAuth(): Promise<boolean> {
      const isTokenValid = this.isTokenValid()
      if (isTokenValid) {
        return true
      }
      try {
        await this.refreshOnce()
        return true
      } catch {
        this.clearAuth()
        return false
      }
    },
  },
  persist: {
    storage: localStorage,
    pick: ['companyName', 'hasLoginHistory'],
  },
})
