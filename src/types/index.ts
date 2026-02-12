import type { Component } from 'vue'

export interface RouteItem {
  path: string
  name: string
  sidebar: boolean
  component: Component
  icon?: Component | string
}
