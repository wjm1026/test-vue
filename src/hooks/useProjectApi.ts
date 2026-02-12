import { useMutation } from '@tanstack/vue-query'

import { registrationProject } from '@/api/index'

export const useProjectApi = () => {
  const { mutateAsync: submitProject, isPending } = useMutation({
    mutationFn: registrationProject,
  })

  return {
    submitProject,
    isPending,
  }
}
