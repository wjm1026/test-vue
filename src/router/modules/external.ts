import type { RouteRecordRaw } from 'vue-router'

import { routeNames } from '../names'
import { routePaths } from '../paths'

import ShareIcon from '@/components/icon/ShareIcon.vue'
import { UserRoleEnum } from '@/enum'

// TODO：change link
const EXTERNAL_LINK =
  'https://www.figma.com/design/stavgeKsYfzpHRR5t9M8yj/%E5%96%B6%E6%A5%AD%E7%94%A8_ForesightConnect%E3%83%A2%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97?node-id=9991-56228&t=VT6ftTep9qXrs1Te-0'

const EmptyComponent = { template: '<div></div>' }

export const externalRoutes: RouteRecordRaw[] = [
  {
    path: routePaths.external.support,
    name: routeNames.external.support,
    meta: {
      menu: 'サポート',
      sidebar: true,
      highlight: true,
      viewableRoles: [
        UserRoleEnum.RepresentativeAdmin,
        UserRoleEnum.ManagementUser,
        UserRoleEnum.GeneralUser,
      ],
      icon: ShareIcon,
    },
    component: EmptyComponent,
    beforeEnter: () => {
      window.open(EXTERNAL_LINK, '_blank', 'noopener,noreferrer')
      return false
    },
  },
]
