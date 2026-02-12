/**
 * Removes keys with empty values (undefined, null, or empty string) from an object.
 */
export const removeEmptyValues = <T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value
    }
  }
  return result
}
