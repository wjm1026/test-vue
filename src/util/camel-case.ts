/**
 * Recursively converts all object keys from snake_case to camelCase.
 */
export const toCamelCaseKeys = <T>(obj: unknown): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCaseKeys(item)) as unknown as T
  } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const newObj = {} as Record<string, unknown>
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
      newObj[camelKey] = toCamelCaseKeys(value)
    }
    return newObj as T
  }
  return obj as T
}

/**
 * Converts a camelCase string to snake_case.
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Checks if a string is a camelCase identifier (starts with lowercase, contains uppercase).
 */
const isCamelCaseIdentifier = (str: string): boolean => {
  return /^[a-z][a-zA-Z0-9]*$/.test(str) && /[A-Z]/.test(str)
}

/**
 * Field keys whose values should NOT be converted (user input fields).
 */
const SKIP_VALUE_CONVERSION_KEYS = new Set(['query', 'keyword'])

/**
 * Recursively converts all object keys from camelCase to snake_case.
 * Also converts string values that are camelCase identifiers to snake_case,
 * except for fields in SKIP_VALUE_CONVERSION_KEYS (user input fields).
 */
export const camelToSnake = <T>(obj: unknown, currentKey?: string): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item)) as T
  } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = toSnakeCase(key)
      let convertedValue = camelToSnake(value, key)
      // Convert string values except for user input fields
      if (
        typeof convertedValue === 'string' &&
        isCamelCaseIdentifier(convertedValue) &&
        !SKIP_VALUE_CONVERSION_KEYS.has(key)
      ) {
        convertedValue = toSnakeCase(convertedValue) as typeof convertedValue
      }
      result[snakeKey] = convertedValue
    }
    return result as T
  } else if (
    typeof obj === 'string' &&
    isCamelCaseIdentifier(obj) &&
    currentKey &&
    !SKIP_VALUE_CONVERSION_KEYS.has(currentKey)
  ) {
    return toSnakeCase(obj) as T
  }
  return obj as T
}
