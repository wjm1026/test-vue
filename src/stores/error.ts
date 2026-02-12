import { defineStore } from 'pinia'

interface ErrorState {
  showErrorDialog: boolean
}

export const useErrorStore = defineStore('error', {
  state: (): ErrorState => ({
    showErrorDialog: false,
  }),

  actions: {
    showError() {
      this.showErrorDialog = true
    },
    hideError() {
      this.showErrorDialog = false
    },
  },
})
