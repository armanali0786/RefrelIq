import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Context } from 'hono'

type AppCtx = Context<{ Bindings: Env }>

interface Env {
  ANTHROPIC_API_KEY: string
  HUNTER_API_KEY:    string
  JWT_SECRET:        string
  KV: KVNamespace
}

interface StoredUser {
  id:           string
  email:        string
  passwordHash: string
  salt:         string
  credits:      number
  createdAt:    number
}

// ─── Crypto helpers ───────────────────────────────────────────────────────────

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64)
  const bytes  = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function base64url(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function unbase64url(s: string): string {
  return s.replace(/-/g, '+').replace(/_/g, '/')
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100_000, hash: 'SHA-256' },
    keyMaterial, 256,
  )
  return bytesToBase64(new Uint8Array(bits))
}

async function generateSalt(): Promise<string> {
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(16)))
}

async function generateId(): Promise<string> {
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(12)))
    .replace(/[+/=]/g, '')
    .slice(0, 16)
}

async function signJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = base64url(btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })))
  const body   = base64url(btoa(JSON.stringify(payload)))
  const data   = `${header}.${body}`
  const key    = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return `${data}.${base64url(bytesToBase64(new Uint8Array(sig)))}`
}

async function verifyJWT(
  token: string,
  secret: string,
): Promise<Record<string, unknown>> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Malformed token')

  const [header, body, signature] = parts as [string, string, string]
  const data = `${header}.${body}`

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'],
  )
  const sigBytes = base64ToBytes(unbase64url(signature))
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))
  if (!valid) throw new Error('Invalid signature')

  const payload = JSON.parse(atob(unbase64url(body))) as Record<string, unknown>
  if (typeof payload['exp'] === 'number' && payload['exp'] < Date.now() / 1000) {
    throw new Error('Token expired')
  }
  return payload
}

// ─── App ──────────────────────────────────────────────────────────────────────

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors({
  origin: (origin: string) => {
    if (!origin) return '*'
    if (origin.startsWith('chrome-extension://')) return origin
    if (origin.startsWith('http://localhost')) return origin
    return null
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Auth: Sign up ────────────────────────────────────────────────────────────

app.post('/api/auth/signup', async (c: AppCtx) => {
  const { email, password } = await c.req.json() as { email: string; password: string }

  if (!email || !password || password.length < 8) {
    return c.json({ error: 'Email and password (min 8 chars) are required.' }, 400)
  }

  const key = `user:${email.toLowerCase()}`
  const existing = await c.env.KV.get(key)
  if (existing) {
    return c.json({ error: 'An account with this email already exists.' }, 409)
  }

  const salt         = await generateSalt()
  const passwordHash = await hashPassword(password, salt)
  const id           = await generateId()
  const now          = Date.now()
  const WELCOME_CREDITS = 50

  const user: StoredUser = {
    id, email: email.toLowerCase(), passwordHash, salt,
    credits: WELCOME_CREDITS, createdAt: now,
  }
  await c.env.KV.put(key, JSON.stringify(user))

  const expiresAt = Math.floor(now / 1000) + 7 * 24 * 60 * 60  // 7 days
  const token     = await signJWT({ sub: user.id, email: user.email, exp: expiresAt }, c.env.JWT_SECRET)

  return c.json({
    session: {
      token,
      expiresAt: expiresAt * 1000,
      user: { id: user.id, email: user.email, credits: user.credits, createdAt: user.createdAt },
    },
  }, 201)
})

// ─── Auth: Login ──────────────────────────────────────────────────────────────

app.post('/api/auth/login', async (c: AppCtx) => {
  const { email, password } = await c.req.json() as { email: string; password: string }

  if (!email || !password) {
    return c.json({ error: 'Email and password are required.' }, 400)
  }

  const key    = `user:${email.toLowerCase()}`
  const stored = await c.env.KV.get(key)
  if (!stored) {
    return c.json({ error: 'Invalid email or password.' }, 401)
  }

  const user: StoredUser = JSON.parse(stored)
  const hash = await hashPassword(password, user.salt)
  if (hash !== user.passwordHash) {
    return c.json({ error: 'Invalid email or password.' }, 401)
  }

  const now       = Date.now()
  const expiresAt = Math.floor(now / 1000) + 7 * 24 * 60 * 60
  const token     = await signJWT({ sub: user.id, email: user.email, exp: expiresAt }, c.env.JWT_SECRET)

  return c.json({
    session: {
      token,
      expiresAt: expiresAt * 1000,
      user: { id: user.id, email: user.email, credits: user.credits, createdAt: user.createdAt },
    },
  })
})

// ─── Auth: Verify token + return fresh user ───────────────────────────────────

app.get('/api/auth/verify', async (c: AppCtx) => {
  const authHeader = c.req.header('Authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) return c.json({ error: 'Missing token' }, 401)

  let payload: Record<string, unknown>
  try {
    payload = await verifyJWT(token, c.env.JWT_SECRET)
  } catch (e) {
    return c.json({ error: (e as Error).message }, 401)
  }

  const email  = payload['email'] as string
  const stored = await c.env.KV.get(`user:${email}`)
  if (!stored) return c.json({ error: 'User not found' }, 404)

  const user: StoredUser = JSON.parse(stored)
  return c.json({ id: user.id, email: user.email, credits: user.credits, createdAt: user.createdAt })
})

// ─── Credits: deduct (called by service worker after a draft) ─────────────────

app.post('/api/credits/deduct', async (c: AppCtx) => {
  const authHeader = c.req.header('Authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) return c.json({ error: 'Missing token' }, 401)

  let payload: Record<string, unknown>
  try {
    payload = await verifyJWT(token, c.env.JWT_SECRET)
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }

  const { amount } = await c.req.json() as { amount: number }
  const email = payload['email'] as string
  const key   = `user:${email}`
  const stored = await c.env.KV.get(key)
  if (!stored) return c.json({ error: 'User not found' }, 404)

  const user: StoredUser = JSON.parse(stored)
  if (user.credits < amount) return c.json({ error: 'Insufficient credits' }, 402)

  user.credits = Math.max(0, user.credits - amount)
  await c.env.KV.put(key, JSON.stringify(user))
  return c.json({ credits: user.credits })
})

// ─── AI: Draft message ────────────────────────────────────────────────────────

app.post('/api/draft-message', async (c: AppCtx) => {
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

// ─── AI: Parse resume ─────────────────────────────────────────────────────────

app.post('/api/parse-resume', async (c: AppCtx) => {
  const { base64, mimeType } = await c.req.json() as { base64: string; mimeType: string }
  const apiKey = c.env.ANTHROPIC_API_KEY

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
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

// ─── Registry ─────────────────────────────────────────────────────────────────

app.get('/registry/version.json', async (c: AppCtx) => {
  const version = await c.env.KV.get('registry_version') ?? '1'
  return c.json({ version: parseInt(version) })
})

app.get('/registry/latest.json', async (c: AppCtx) => {
  const registry = await c.env.KV.get('scraper_registry', 'json')
  return c.json(registry ?? {})
})

export default app
