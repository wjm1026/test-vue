export const downloadBlob = (blob: Blob, headers?: Record<string, string | string[] | number>) => {
  let finalFileName: string | undefined

  if (headers) {
    const contentDisposition =
      (headers['content-disposition'] as string) || (headers['Content-Disposition'] as string)
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (fileNameMatch && fileNameMatch[1]) {
        finalFileName = fileNameMatch[1].replace(/['"]/g, '')
      }
    }
  }

  if (!finalFileName) {
    finalFileName = `download_${Date.now()}`
  }

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = finalFileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
