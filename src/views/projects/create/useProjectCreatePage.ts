import { reactive, ref } from 'vue'

import type { RegistrationProjectData } from '@/api/types/projects'
export const useProjectCreatePage = () => {
  const createVisible = ref(false)
  const project = reactive<RegistrationProjectData>({
    name: '',
    startDate: '',
    endDate: '',
    products: [],
  })

  const successProjectSubmit = (pro: RegistrationProjectData) => {
    project.name = pro.name
    project.startDate = pro.startDate
    project.endDate = pro.endDate
    createVisible.value = true
  }

  return {
    createVisible,
    project,
    successProjectSubmit,
  }
}
