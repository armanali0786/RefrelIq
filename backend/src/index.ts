import { Hono } from 'hono'
import { cors } from 'hono/cors'

interface Env {
  ANTHROPIC_API_KEY: string
  HUNTER_API_KEY:    string
  KV: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors({ origin: ['chrome-extension://*', 'http://localhost:*'] }))

app.post('/api/draft-message', async (c) => {
  const body   = await c.req.json()
  const apiKey = c.env.ANTHROPIC_API_KEY

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return c.json(data)
})

app.post('/api/parse-resume', async (c) => {
  const { base64, mimeType } = await c.req.json() as { base64: string; mimeType: string }
  const apiKey = c.env.ANTHROPIC_API_KEY

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':    apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: mimeType, data: base64 } },
          { type: 'text', text: 'Extract structured data. Return only JSON: {"name":string,"currentRole":string,"yearsExp":number,"skills":string[],"topSkills":string[],"education":string,"companies":string[]}' },
        ],
      }],
    }),
  })
  const data = await res.json() as { content: Array<{ text: string }> }
  const text = data.content[0]?.text ?? '{}'
  return c.json(JSON.parse(text.replace(/```json|```/g, '').trim()))
})

app.get('/registry/version.json', async (c) => {
  const version = await c.env.KV.get('registry_version') ?? '1'
  return c.json({ version: parseInt(version) })
})

app.get('/registry/latest.json', async (c) => {
  const registry = await c.env.KV.get('scraper_registry', 'json')
  return c.json(registry ?? {})
})

export default app
