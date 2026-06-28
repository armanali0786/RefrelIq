import { BACKEND_URL } from '@/constants/config'
import type { AuthSession, AuthUser } from '@/types/auth'

interface AuthResponse {
  session: AuthSession
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Network error. Please check your connection.')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' })) as { error?: string }
    throw new Error(err.error ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

export async function apiSignup(email: string, password: string): Promise<AuthSession> {
  const data = await post<AuthResponse>('/api/auth/signup', { email, password })
  return data.session
}

export async function apiLogin(email: string, password: string): Promise<AuthSession> {
  const data = await post<AuthResponse>('/api/auth/login', { email, password })
  return data.session
}

export async function apiVerifyToken(token: string): Promise<AuthUser> {
  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new Error('Network error')
  }
  if (!res.ok) throw new Error('Token invalid or expired')
  return res.json() as Promise<AuthUser>
}
