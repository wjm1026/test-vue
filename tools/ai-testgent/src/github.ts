import { parseJsonSafe } from './utils.js'

interface GitHubPullRequestFileResponse {
  filename: string
  patch?: string
}

export interface PullRequestFile {
  path: string
  patch: string
}

const GITHUB_API_BASE = process.env.GITHUB_API_URL ?? 'https://api.github.com'

async function githubRequest<T>(token: string, endpoint: string, init: RequestInit = {}) {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'ai-testgent',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GitHub API request failed (${response.status}): ${text}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const parsed = parseJsonSafe<T>(text)

  if (!parsed) {
    throw new Error(`Unable to parse GitHub API response as JSON for ${endpoint}`)
  }

  return parsed
}

export async function listPullRequestFiles(token: string, repo: string, prNumber: number) {
  const files: PullRequestFile[] = []
  let page = 1

  while (true) {
    const endpoint = `/repos/${repo}/pulls/${prNumber}/files?per_page=100&page=${page}`
    const payload = await githubRequest<GitHubPullRequestFileResponse[]>(token, endpoint)

    if (!payload.length) {
      break
    }

    for (const file of payload) {
      files.push({
        path: file.filename,
        patch: file.patch ?? '',
      })
    }

    if (payload.length < 100) {
      break
    }

    page += 1
  }

  return files
}

export async function createPullRequestComment(token: string, repo: string, prNumber: number, body: string) {
  return githubRequest(token, `/repos/${repo}/issues/${prNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  })
}
