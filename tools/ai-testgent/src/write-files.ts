import fs from 'node:fs/promises'
import path from 'node:path'

import type { GeneratedFile } from './types.js'
import { resolveSafeWritePath, uniqBy } from './utils.js'

interface WriteFilesOptions {
  rootDir: string
  dryRun?: boolean
}

export async function writeGeneratedFiles(files: GeneratedFile[], options: WriteFilesOptions) {
  const uniqueFiles = uniqBy(files, (file) => file.path)
  const writtenPaths: string[] = []

  for (const file of uniqueFiles) {
    const { absolutePath, relativePath } = resolveSafeWritePath(options.rootDir, file.path)

    if (!options.dryRun) {
      await fs.mkdir(path.dirname(absolutePath), { recursive: true })
      await fs.writeFile(absolutePath, file.content, 'utf8')
    }

    writtenPaths.push(relativePath)
  }

  return writtenPaths
}
