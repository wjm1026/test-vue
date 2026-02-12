import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import message from '@/enum/message.json'
import { useForgetPasswordApi } from '@/hooks/useForgetPasswordApi'
import { pattern } from '@/enum'
import type { ForgetPasswordRequestBody } from '@/api/types/login'

export const useForgetPasswordForm = (
  emit: { (event: 'emailSubmitSuccess', email: string): void },
  initialEmail?: string,
) => {
  const router = useRouter()
  const { forgetPasswordMutation, isPending } = useForgetPasswordApi()
  const forgetPasswordFormRef = ref<FormInstance>()
  const forgetPasswordFormRules = reactive<FormRules<ForgetPasswordRequestBody>>({
    email: [
      { required: true, message: message.login.emailRequired, trigger: 'blur' },
      {
        pattern: pattern.email,
        message: message.login.emailInvalid,
        trigger: ['blur', 'change'],
      },
    ],
  })
  const forgetPasswordForm = reactive<ForgetPasswordRequestBody>({
    email: initialEmail || '',
  })

  const isEmailValid = computed(() => pattern.email.test(forgetPasswordForm.email))
  const disabled = computed(() => !isEmailValid.value)

  const forgetPasswordFormSubmit = async () => {
    if (!forgetPasswordFormRef.value) return

    await forgetPasswordFormRef.value.validate(async (valid) => {
      if (!valid) return

      await forgetPasswordMutation({
        email: forgetPasswordForm.email,
      })
      emit('emailSubmitSuccess', forgetPasswordForm.email)
    })
  }
  const goBack = () => router.go(-1)

  return {
    disabled,
    forgetPasswordForm,
    forgetPasswordFormRef,
    forgetPasswordFormRules,
    forgetPasswordFormSubmit,
    goBack,
    isPending,
  }
}
