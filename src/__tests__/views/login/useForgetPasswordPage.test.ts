import { describe, expect, it } from 'vitest'

import { useForgetPasswordPage } from '@/views/login/useForgetPasswordPage'

describe('useForgetPasswordPage', () => {
  it('advances to notice after emailSubmitSuccess', () => {
    const { activeStep, emailSubmitSuccess, savedEmail } = useForgetPasswordPage()

    expect(activeStep.value).toBe(0)

    emailSubmitSuccess('user@example.com')

    expect(activeStep.value).toBe(1)
    expect(savedEmail.value).toBe('user@example.com')
  })
})
