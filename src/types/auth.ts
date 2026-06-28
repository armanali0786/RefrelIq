export interface AuthUser {
  id: string
  email: string
  credits: number
  createdAt: number
}

export interface AuthSession {
  user: AuthUser
  token: string
  expiresAt: number
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_TAKEN'
  | 'NETWORK_ERROR'
  | 'TOKEN_EXPIRED'
  | 'INVALID_TOKEN'
  | 'WEAK_PASSWORD'

export interface AuthError {
  code: AuthErrorCode
  message: string
}
