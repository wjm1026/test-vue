import { extractJsonObject, parseJsonSafe } from './utils.js'

interface LlmRequestPayload {
  model: string
  messages: Array<{ role: 'system' | 'user'; content: string }>
  temperature: number
}

interface LlmChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

export class LlmClient {
  readonly enabled: boolean
  readonly model: string

  private readonly apiKey?: string
  private readonly baseUrl: string
  private readonly timeoutMs: number

  constructor(env: NodeJS.ProcessEnv = process.env) {
    this.apiKey = env.LLM_API_KEY
    this.baseUrl = (env.LLM_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '')
    this.model = env.LLM_MODEL ?? 'gpt-4o-mini'
    this.timeoutMs = Number(env.LLM_TIMEOUT_MS ?? 60_000)
    this.enabled = Boolean(this.apiKey)
  }

  async requestJson<T>(prompt: string, input: unknown) {
    if (!this.enabled || !this.apiKey) {
      return undefined
    }

    const userContent = [
      'You must return valid JSON only. Do not wrap in markdown.',
      'Input JSON:',
      JSON.stringify(input),
    ].join('\n\n')

    const payload: LlmRequestPayload = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      temperature: 0.1,
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`LLM API request failed (${response.status}): ${text}`)
      }

      const text = await response.text()
      const parsed = parseJsonSafe<LlmChatCompletionResponse>(text)
      const content = parsed?.choices?.[0]?.message?.content

      if (!content) {
        return undefined
      }

      const jsonText = extractJsonObject(content)
      return parseJsonSafe<T>(jsonText)
    } catch (error) {
      console.warn('[ai-testgent] LLM request failed, fallback to heuristic flow.')
      console.warn(String(error))
      return undefined
    } finally {
      clearTimeout(timer)
    }
  }
}
