import { useAuthStore } from '@/store/useAuthStore'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

export function AuthScreen() {
  const { screen, setScreen } = useAuthStore()

  return (
    <div style={{ width: 360, background: '#F3F0EE', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{
        padding: '24px 24px 20px',
        borderBottom: '1px solid #E0DBD6',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 50,
          background: '#141413', color: '#F3F0EE',
          fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          R
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#141413' }}>ReferralIQ</div>
          <div style={{ fontSize: 11, color: '#8A8785' }}>Smart Job Intelligence</div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'flex', borderBottom: '1px solid #E0DBD6',
        background: '#FCFBFA',
      }}>
        {(['login', 'signup'] as const).map(s => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            style={{
              flex: 1, padding: '12px 0',
              fontSize: 13, fontWeight: 600,
              color: screen === s ? '#141413' : '#8A8785',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: screen === s ? '2px solid #141413' : '2px solid transparent',
              transition: 'color 0.15s, border-color 0.15s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {s === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        ))}
      </div>

      {/* Form area */}
      <div style={{ padding: '20px 24px 24px' }}>
        {screen === 'login' ? <LoginForm /> : <SignupForm />}

        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: '1px solid #E0DBD6',
          fontSize: 11, color: '#8A8785', textAlign: 'center', lineHeight: 1.5,
        }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
          Your data stays on your device.
        </div>
      </div>
    </div>
  )
}
