import { create } from 'zustand'
import type { AuthUser } from '@/types/auth'
import { cache } from '@/utils/cache'
import { apiLogin, apiSignup, apiVerifyToken } from '@/utils/auth-client'

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'
export type AuthScreen = 'login' | 'signup'

interface AuthStore {
  user: AuthUser | null
  status: AuthStatus
  error: string | null
  isNewUser: boolean
  screen: AuthScreen
  isSubmitting: boolean

  checkSession(): Promise<void>
  login(email: string, password: string): Promise<void>
  signup(email: string, password: string): Promise<void>
  logout(): Promise<void>
  setScreen(s: AuthScreen): void
  clearError(): void
  refreshCredits(): Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  status: 'checking',
  error: null,
  isNewUser: false,
  screen: 'login',
  isSubmitting: false,

  async checkSession() {
    set({ status: 'checking' })
    try {
      const session = await cache.getAuthSession()
      if (!session) {
        set({ status: 'unauthenticated' })
        return
      }
      // Use cached data immediately — no spinner blocking the UI
      set({ user: session.user, status: 'authenticated' })
      // Silently refresh credits from server in background
      try {
        const fresh = await apiVerifyToken(session.token)
        const updated: AuthUser = { ...session.user, credits: fresh.credits }
        await cache.setAuthSession({ ...session, user: updated })
        await cache.setCredits(fresh.credits)
        set({ user: updated })
      } catch {
        // Network unavailable — keep using cached data, don't log out
      }
    } catch {
      await cache.clearAuthSession()
      set({ status: 'unauthenticated' })
    }
  },

  async login(email, password) {
    set({ error: null, isSubmitting: true })
    try {
      const session = await apiLogin(email, password)
      await cache.setAuthSession(session)
      await cache.setCredits(session.user.credits)
      set({ user: session.user, status: 'authenticated', isNewUser: false, isSubmitting: false })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login failed. Please try again.'
      set({ error: msg, isSubmitting: false })
    }
  },

  async signup(email, password) {
    set({ error: null, isSubmitting: true })
    try {
      const session = await apiSignup(email, password)
      await cache.setAuthSession(session)
      await cache.setCredits(session.user.credits)
      set({ user: session.user, status: 'authenticated', isNewUser: true, isSubmitting: false })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign up failed. Please try again.'
      set({ error: msg, isSubmitting: false })
    }
  },

  async logout() {
    await cache.clearAuthSession()
    set({ user: null, status: 'unauthenticated', isNewUser: false, screen: 'login', error: null })
  },

  setScreen(screen) {
    set({ screen, error: null })
  },

  clearError() {
    set({ error: null })
  },

  async refreshCredits() {
    const credits = await cache.getCredits()
    const { user } = get()
    if (user) set({ user: { ...user, credits } })
  },
}))
