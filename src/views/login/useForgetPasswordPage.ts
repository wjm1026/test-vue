import { ref } from 'vue'

export const useForgetPasswordPage = () => {
  const activeStep = ref(0)
  const savedEmail = ref<string>('')

  const emailSubmitSuccess = (email: string) => {
    savedEmail.value = email
    activeStep.value = 1
  }

  return { activeStep, emailSubmitSuccess, savedEmail }
}
