import { ref } from 'vue'

import { downloadCommentListCSV } from '@/api/comments'
import type { CommentListCSVDownloadParams } from '@/api/types/comments'
import { downloadBlob } from '@/util/download-helper'

export const useCommentListCSVDownload = () => {
  const isDownloading = ref(false)

  const downloadCSV = async (params: CommentListCSVDownloadParams) => {
    if (isDownloading.value) return

    isDownloading.value = true

    const response = await downloadCommentListCSV(params)
    downloadBlob(response.blob, response.headers)

    isDownloading.value = false
  }

  return {
    isDownloading,
    downloadCSV,
  }
}
