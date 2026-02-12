import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import message from '@/enum/message.json'
import { pattern } from '@/enum'
import { useResetPasswordApi } from '@/hooks/useResetPasswordApi'

type ResetPasswordFormFields = {
  password: string
  confirmPassword: string
}

export const useResetPasswordForm = (emit: { (event: 'resetPasswordSubmitSuccess'): void }) => {
  const route = useRoute()
  const { resetPasswordMutation, isPending } = useResetPasswordApi()
  const token = computed(() => route.query.token as string | undefined)

  const resetPasswordForm = reactive<ResetPasswordFormFields>({
    password: '',
    confirmPassword: '',
  })
  const resetPasswordFormRef = ref<FormInstance>()
  const resetPasswordFormRules = reactive<FormRules<ResetPasswordFormFields>>({
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
    confirmPassword: [
      { required: true, message: message.login.confirmPasswordRequired, trigger: 'blur' },
      {
        min: 12,
        message: message.login.passwordLength,
      },
      {
        validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
          if (value === '') {
            callback(new Error(message.login.confirmPasswordRequired))
          } else if (value !== resetPasswordForm.password) {
            callback(new Error(message.login.confirmPasswordNotMatch))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change'],
      },
    ],
  })

  const isPasswordValid = computed(() => pattern.password.test(resetPasswordForm.password))
  const passwordsMatch = computed(
    () => resetPasswordForm.confirmPassword === resetPasswordForm.password,
  )
  const disabled = computed(() => !(isPasswordValid.value && passwordsMatch.value))

  const resetPasswordFormSubmit = async () => {
    if (!resetPasswordFormRef.value) return
    const resetToken = token.value
    if (!resetToken) {
      ElMessage.error(message.login.resetPasswordInvalidToken)
      return
    }

    await resetPasswordFormRef.value.validate(async (valid) => {
      if (!valid) return

      await resetPasswordMutation({
        newPassword: resetPasswordForm.password,
        resetToken: resetToken,
      })

      ElMessage.success(message.login.resetPasswordSuccess)
      emit('resetPasswordSubmitSuccess')
    })
  }

  watch(
    () => resetPasswordForm.password,
    () => {
      if (!resetPasswordFormRef.value) return
      if (!resetPasswordForm.confirmPassword) return
      resetPasswordFormRef.value.validate()
    },
  )

  return {
    disabled,
    resetPasswordForm,
    resetPasswordFormRef,
    resetPasswordFormRules,
    resetPasswordFormSubmit,
    isPending,
  }
}
