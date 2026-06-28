import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

const S = {
  form:  { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  label: { fontSize: 12, fontWeight: 600, color: '#555555', marginBottom: 4 },
  input: {
    width: '100%', boxSizing: 'border-box' as const,
    padding: '10px 12px', fontSize: 14, color: '#141413',
    background: '#FCFBFA', border: '1.5px solid #E0DBD6',
    borderRadius: 12, outline: 'none', fontFamily: 'Inter, sans-serif',
  },
  inputFocus:   { border: '1.5px solid #141413' },
  inputInvalid: { border: '1.5px solid #CF4500' },
  hint: { fontSize: 11, color: '#8A8785', marginTop: 4 },
  btn:  {
    width: '100%', padding: '12px', marginTop: 4,
    fontSize: 14, fontWeight: 700, color: '#F3F0EE',
    background: '#1A7A4A', border: 'none', borderRadius: 12,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'opacity 0.15s',
  },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' as const },
  error: {
    fontSize: 12, color: '#CF4500', background: '#FFF4EE',
    border: '1px solid #FFCFB8', borderRadius: 8, padding: '8px 12px',
  },
  link: { fontSize: 12, color: '#8A8785', textAlign: 'center' as const, marginTop: 4 },
}

export function SignupForm() {
  const { signup, isSubmitting, error, setScreen } = useAuthStore()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [focused, setFocused]   = useState<string | null>(null)

  const passwordMismatch = confirm.length > 0 && confirm !== password
  const passwordShort    = password.length > 0 && password.length < 8
  const disabled = isSubmitting || !email.trim() || password.length < 8 || password !== confirm

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return
    signup(email.trim().toLowerCase(), password)
  }

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
          style={{
            ...S.input,
            ...(focused === 'password' ? S.inputFocus : {}),
            ...(passwordShort ? S.inputInvalid : {}),
          }}
          required
        />
        {passwordShort && <div style={{ ...S.hint, color: '#CF4500' }}>Minimum 8 characters</div>}
      </div>

      <div>
        <div style={S.label}>Confirm password</div>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Repeat password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onFocus={() => setFocused('confirm')}
          onBlur={() => setFocused(null)}
          style={{
            ...S.input,
            ...(focused === 'confirm' ? S.inputFocus : {}),
            ...(passwordMismatch ? S.inputInvalid : {}),
          }}
          required
        />
        {passwordMismatch && <div style={{ ...S.hint, color: '#CF4500' }}>Passwords don't match</div>}
      </div>

      <button
        type="submit"
        disabled={disabled}
        style={{ ...S.btn, ...(disabled ? S.btnDisabled : {}) }}
      >
        {isSubmitting ? 'Creating account…' : 'Create free account'}
      </button>

      <div style={S.link}>
        Already have an account?{' '}
        <span
          style={{ color: '#141413', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => setScreen('login')}
        >
          Sign in
        </span>
      </div>
    </form>
  )
}
