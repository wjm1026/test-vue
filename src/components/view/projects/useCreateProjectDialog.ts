import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { routePaths } from '@/router/routes'
import type { RegistrationProjectData } from '@/api/types/projects'

export const uesCreateProjectDialog = (
  props: {
    modelValue: boolean
    project: RegistrationProjectData
  },
  emit: (event: 'closeDialog') => void,
) => {
  const router = useRouter()

  const projectVisible = ref(false)
  const closeProjectDialog = () => {
    projectVisible.value = false
    emit('closeDialog')
    router.push(routePaths.projects.root)
  }

  const imageUrl = computed(() => props.project?.products[0]?.imageUrl)

  watch(
    () => props.modelValue,
    (val) => {
      projectVisible.value = val
    },
    { immediate: true },
  )

  return {
    projectVisible,
    imageUrl,
    closeProjectDialog,
  }
}
