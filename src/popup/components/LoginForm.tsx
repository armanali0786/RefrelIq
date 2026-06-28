import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

const S = {
  form:    { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  label:   { fontSize: 12, fontWeight: 600, color: '#555555', marginBottom: 4 },
  input:   {
    width: '100%', boxSizing: 'border-box' as const,
    padding: '10px 12px', fontSize: 14, color: '#141413',
    background: '#FCFBFA', border: '1.5px solid #E0DBD6',
    borderRadius: 12, outline: 'none', fontFamily: 'Inter, sans-serif',
  },
  inputFocus: { border: '1.5px solid #141413' },
  btn:  {
    width: '100%', padding: '12px', marginTop: 4,
    fontSize: 14, fontWeight: 700, color: '#F3F0EE',
    background: '#141413', border: 'none', borderRadius: 12,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'opacity 0.15s',
  },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' as const },
  error: {
    fontSize: 12, color: '#CF4500', background: '#FFF4EE',
    border: '1px solid #FFCFB8', borderRadius: 8, padding: '8px 12px',
  },
  forgot: { fontSize: 12, color: '#8A8785', textAlign: 'center' as const, marginTop: 4 },
}

export function LoginForm() {
  const { login, isSubmitting, error, setScreen } = useAuthStore()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused]   = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    login(email.trim().toLowerCase(), password)
  }

  const disabled = isSubmitting || !email.trim() || !password

  return (
    <form style={S.form} onSubmit={handleSubmit}>
      {error && <div style={S.error}>{error}</div>}

      <div>
        <div style={S.label}>Email</div>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
          style={{ ...S.input, ...(focused === 'email' ? S.inputFocus : {}) }}
          required
        />
      </div>

      <div>
        <div style={S.label}>Password</div>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
          style={{ ...S.input, ...(focused === 'password' ? S.inputFocus : {}) }}
          required
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        style={{ ...S.btn, ...(disabled ? S.btnDisabled : {}) }}
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>

      <div style={S.forgot}>
        Don't have an account?{' '}
        <span
          style={{ color: '#141413', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setScreen('signup')}
        >
          Sign up free
        </span>
      </div>
    </form>
  )
}
