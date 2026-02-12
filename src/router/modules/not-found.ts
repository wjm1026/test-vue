import type { RouteRecordRaw } from 'vue-router'

const NotFoundPage = () => import('@/views/not-found/NotFound.vue')

export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: NotFoundPage,
}
