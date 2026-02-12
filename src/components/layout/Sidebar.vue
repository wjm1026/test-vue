<template>
  <ElAside class="bg-gray200 w-[240px]">
    <ElScrollbar
      class="flex flex-col justify-between"
      view-class="h-full flex flex-col justify-between"
    >
      <div class="mx-5">
        <BaseImage :src="logoSidebarImage" class="my-14 h-[60px] w-[200px]" />
        <ElMenu
          class="bg-gray200 border-none"
          unique-opened
          router
          :default-active="activeMenu"
          :active-text-color="themeConfig.color.primary600"
          @select="handleMenuSelect"
        >
          <template v-for="(menu, index) in menus" :key="menu.path">
            <ElMenuItem
              :index="menu.path"
              class="hover:text-primary600 flex flex-col items-start p-0 hover:bg-transparent"
            >
              <div class="flex items-center px-5">
                <ElIcon
                  v-if="menu.meta?.icon"
                  size="16"
                  class="mr-0"
                  :class="{ 'text-primary600': isHighlightMenu(menu) }"
                >
                  <component :is="menu.meta?.icon" />
                </ElIcon>
                <p
                  class="text-[12px] font-semibold"
                  :class="{ 'text-primary600': isHighlightMenu(menu) }"
                >
                  {{ menu.meta?.menu }}
                </p>
              </div>
              <ElDivider class="border-gray400 m-0" v-if="index < menus.length - 1" />
            </ElMenuItem>
          </template>
        </ElMenu>
      </div>
      <div class="m-5 flex justify-between">
        <div class="flex justify-center gap-[6px]">
          <ElText data-testid="company-name" class="text-gray800 text-xs">{{
            authStore.companyName
          }}</ElText>
        </div>
        <ElText class="text-gray800 text-xs">様</ElText>
      </div>
    </ElScrollbar>
  </ElAside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import logoSidebarImage from '@/assets/images/logo-sidebar.png'
import { routes, routePaths } from '@/router/routes'
import { themeConfig } from '@/shared/theme'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const menus = computed(() =>
  routes
    .filter((route) => route.meta?.sidebar)
    .filter((route) => {
      const roles = route.meta?.viewableRoles
      if (!Array.isArray(roles)) {
        return false
      }

      return roles.includes(authStore.role)
    }),
)

const activeMenu = computed(() => {
  const currentPath = route.path

  const matchedMenu = menus.value.find(
    (menu) =>
      menu.path === currentPath ||
      currentPath.includes('/projects') ||
      currentPath.startsWith(menu.path + '/'),
  )

  return matchedMenu?.path || currentPath
})

const handleLogout = () => {
  authStore.clearAuth()
}

const handleMenuSelect = (index: string) => {
  if (index === routePaths.login) {
    handleLogout()
  }
}

const isHighlightMenu = (menu: (typeof menus.value)[number]) => menu.meta?.highlight === true
</script>
