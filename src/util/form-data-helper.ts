export const convertToFormData = <T extends object>(data: T): FormData => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  })
  return formData
}

export const urlToFile = async (url: string, fileName?: string): Promise<File | null> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const name = fileName || url.substring(url.lastIndexOf('/') + 1) || `image_${Date.now()}.jpg`
    const file = new File([blob], name, { type: blob.type })
    return file
  } catch {
    return null
  }
}

export const formatNumberWithCommas = (num: number) => {
  return new Intl.NumberFormat().format(num)
}
