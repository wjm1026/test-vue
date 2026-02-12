import { ref } from 'vue'

import { downloadReportCSV } from '@/api/reports'
import { downloadBlob } from '@/util/download-helper'

export const useReportCSVDownload = () => {
  const isDownloading = ref(false)

  const downloadCSV = async (projectId: number) => {
    if (isDownloading.value) return

    isDownloading.value = true
    const { blob, headers } = await downloadReportCSV(projectId)

    downloadBlob(blob, headers)
    isDownloading.value = false
  }

  return {
    isDownloading,
    downloadCSV,
  }
}
