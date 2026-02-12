import { useMutation } from '@tanstack/vue-query'

import { deleteProject } from '@/api/index'

export const useProjectDeleteApi = () => {
  const { mutateAsync: deleteProjectMutateAsync, isPending: isDeleteLoading } = useMutation({
    mutationFn: deleteProject,
  })
  return {
    deleteProjectMutateAsync,
    isDeleteLoading,
  }
}
