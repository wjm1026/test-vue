import { type FormInstance, type FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import message from '@/enum/message.json'
import { routePaths } from '@/router/routes'
import { useLoginApi } from '@/hooks/useLoginApi'
import { useAuthStore } from '@/stores/auth'
import { pattern } from '@/enum'

interface LoginFormType {
  email: string
  password: string
}

export const useLoginForm = () => {
  const router = useRouter()
  const { loginMutation, isPending } = useLoginApi()
  const { setToken, setExpiresAt, setCompanyName } = useAuthStore()

  const loginForm = reactive<LoginFormType>({
    email: '',
    password: '',
  })
  const loginFormRef = ref<FormInstance>()
  const loginFormRules = reactive<FormRules<LoginFormType>>({
    email: [
      { required: true, message: message.login.emailRequired, trigger: 'blur' },
      {
        pattern: pattern.email,
        message: message.login.emailInvalid,
        trigger: ['blur', 'change'],
      },
    ],
    password: [
      { required: true, message: message.login.passwordRequired, trigger: 'blur' },
      {
        min: 12,
        message: message.login.passwordLength,
      },
      {
        pattern: pattern.password,
        message: message.login.passwordPattern,
        trigger: ['blur', 'change'],
      },
    ],
  })

  const isPasswordValid = computed(() => pattern.password.test(loginForm.password))
  const isEmailValid = computed(() => pattern.email.test(loginForm.email))
  const disabled = computed(() => !isEmailValid.value || !isPasswordValid.value)

  const loginFormSubmit = async () => {
    if (!loginFormRef.value) return

    await loginFormRef.value.validate(async (valid) => {
      if (!valid) return

      const res = await loginMutation(loginForm)
      setToken(res.accessToken)
      setExpiresAt(res.expiresIn)
      setCompanyName(res.companyName)
      ElMessage.success(message.login.success)
      router.push(routePaths.projects.root)
    })
  }

  const forgetPasswordHandle = () => router.push(routePaths.forgetPassword)

  return {
    disabled,
    router,
    isPending,
    loginForm,
    loginFormRef,
    loginFormRules,
    loginFormSubmit,
    forgetPasswordHandle,
  }
}
