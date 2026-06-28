import { useState } from 'react'

export function WelcomeBanner({ credits }: { credits: number }) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A7A4A 0%, #14623B 100%)',
      borderRadius: 16, padding: '16px 16px 16px 20px',
      marginBottom: 16, position: 'relative',
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>🎉</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Welcome to ReferralIQ!
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
          Your account is ready. You've received{' '}
          <strong style={{ color: '#fff' }}>{credits} free credits</strong> to get started —
          use them to draft outreach messages and unlock recruiter insights.
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
