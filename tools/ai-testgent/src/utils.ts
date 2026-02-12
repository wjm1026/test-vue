import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

export interface CommandResult {
  ok: boolean
  exitCode: number | null
  stdout: string
  stderr: string
}

interface RunCommandOptions {
  cwd?: string
  env?: NodeJS.ProcessEnv
  timeoutMs?: number
  shell?: boolean
}

export async function runCommand(
  command: string,
  args: string[] = [],
  options: RunCommandOptions = {},
): Promise<CommandResult> {
  const { cwd = process.cwd(), env = process.env, timeoutMs = 0, shell = false } = options

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env,
      shell,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    const stdoutChunks: string[] = []
    const stderrChunks: string[] = []

    child.stdout.on('data', (chunk: Buffer | string) => {
      stdoutChunks.push(chunk.toString())
    })

    child.stderr.on('data', (chunk: Buffer | string) => {
      stderrChunks.push(chunk.toString())
    })

    let killedByTimeout = false
    let timer: NodeJS.Timeout | undefined

    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        killedByTimeout = true
        child.kill('SIGTERM')
      }, timeoutMs)
    }

    child.on('close', (exitCode) => {
      if (timer) {
        clearTimeout(timer)
      }

      const stdout = stdoutChunks.join('')
      const stderr = stderrChunks.join('')

      resolve({
        ok: !killedByTimeout && exitCode === 0,
        exitCode,
        stdout,
        stderr: killedByTimeout ? `${stderr}\nProcess timeout after ${timeoutMs}ms` : stderr,
      })
    })
  })
}

export async function runCommandLine(commandLine: string, options: Omit<RunCommandOptions, 'shell'> = {}) {
  return runCommand(commandLine, [], { ...options, shell: true })
}

export async function readTextFileIfExists(filePath: string) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return undefined
  }
}

export function truncateByLines(text: string, maxLines: number) {
  const lines = text.split('\n')
  if (lines.length <= maxLines) {
    return text
  }

  const kept = lines.slice(0, maxLines).join('\n')
  return `${kept}\n\n/* truncated ${lines.length - maxLines} lines */`
}

export function parseJsonSafe<T>(value: string) {
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

export function extractJsonObject(raw: string) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) {
    return fenced[1].trim()
  }

  const firstBrace = raw.indexOf('{')
  const lastBrace = raw.lastIndexOf('}')

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return raw.slice(firstBrace, lastBrace + 1)
  }

  return raw
}

export function toPosixPath(filePath: string) {
  return filePath.replaceAll('\\', '/')
}

export function isTestFilePath(filePath: string) {
  const normalized = toPosixPath(filePath)
  return (
    normalized.includes('/__tests__/') ||
    normalized.startsWith('__tests__/') ||
    normalized.startsWith('tests/') ||
    /\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$/.test(normalized)
  )
}

/**
 * Returns true if the file is worth analysing for test generation.
 * Only source files under `src/` (`.vue`, `.ts`, `.tsx`) and test files are
 * considered relevant.  Config files, markdown, lock files, etc. are skipped
 * to avoid wasting LLM context.
 */
export function isAnalysableSourceFile(filePath: string) {
  const normalized = toPosixPath(filePath)

  // Always keep test files — they serve as style examples
  if (isTestFilePath(normalized)) {
    return true
  }

  // Only source files under src/
  if (!normalized.startsWith('src/')) {
    return false
  }

  // Only .vue, .ts, .tsx extensions
  return /\.(vue|ts|tsx)$/.test(normalized)
}

/**
 * Check if a file path is a valid writable test path.
 * Only `src/__tests__/` is allowed — this enforces the project convention
 * of a single, centralised test directory that mirrors the source structure.
 */
export function isWritableTestPath(filePath: string) {
  const normalized = toPosixPath(filePath).replace(/^\.\//, '')
  return normalized.startsWith('src/__tests__/')
}

export function resolveSafeWritePath(rootDir: string, filePath: string) {
  const normalized = toPosixPath(filePath).replace(/^\.\//, '')
  const absolutePath = path.resolve(rootDir, normalized)
  const relative = toPosixPath(path.relative(rootDir, absolutePath))

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refuse to write outside repository: ${filePath}`)
  }

  if (!isWritableTestPath(relative)) {
    throw new Error(`Refuse to write non-test path: ${filePath}`)
  }

  return {
    absolutePath,
    relativePath: relative,
  }
}

export function uniqBy<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>()
  const result: T[] = []

  for (const item of items) {
    const key = getKey(item)
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(item)
  }

  return result
}
