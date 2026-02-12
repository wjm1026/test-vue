import type { UserRoleEnum } from '@/enum'

declare module 'vue-router' {
  interface RouteMeta {
    menu?: string
    sidebar?: boolean
    viewableRoles?: UserRoleEnum[]
  }
}
