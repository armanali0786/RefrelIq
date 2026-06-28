import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { cache } from '@/utils/cache'
import { AuthScreen } from './components/AuthScreen'
import { WelcomeBanner } from './components/WelcomeBanner'
import type { ResumeData } from '@/types/job'

// ─── Loading screen shown while session is being checked ─────────────────────
function LoadingScreen() {
  return (
    <div style={{
      width: 360, height: 200, background: '#F3F0EE',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 50,
          background: '#141413', color: '#F3F0EE',
          fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}>R</div>
        <div style={{ fontSize: 13, color: '#8A8785' }}>Loading…</div>
      </div>
    </div>
  )
}

// ─── Insufficient credits prompt ──────────────────────────────────────────────
function BuyCreditsCard() {
  return (
    <div style={{
      background: '#141413', borderRadius: 16, padding: 16, textAlign: 'center',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#F3F0EE' }}>Out of credits</div>
      <div style={{ fontSize: 12, color: '#8A8785', marginTop: 4 }}>
        Purchase more credits to keep drafting messages and accessing recruiter insights.
      </div>
      <button
        onClick={() => chrome.tabs.create({ url: 'https://referraliq.app/pricing' })}
        style={{
          marginTop: 12, fontSize: 13, fontWeight: 700, color: '#F3F0EE',
          background: '#1A7A4A', border: 'none', borderRadius: 8,
          padding: '8px 16px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}
      >
        Buy credits
      </button>
    </div>
  )
}

// ─── Main authenticated popup ─────────────────────────────────────────────────
function MainApp() {
  const { user, isNewUser, logout, refreshCredits } = useAuthStore()
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [credits, setCredits] = useState(user?.credits ?? 0)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    cache.getResume().then(setResume)
    cache.getCredits().then(c => {
      setCredits(c)
      refreshCredits()
    })
    // Re-read credits whenever the popup gains focus (after a draft deduction)
    const onFocus = () => cache.getCredits().then(setCredits)
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const handleResumeUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1] ?? ''
      chrome.runtime.sendMessage({ type: 'PARSE_RESUME', payload: { base64, mimeType: file.type } })
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div style={{ width: 360, background: '#F3F0EE', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '16px 20px',
        borderBottom: '1px solid #E0DBD6',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 50,
          background: '#141413', color: '#F3F0EE',
          fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          R
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#141413', marginLeft: 10, flex: 1 }}>
          ReferralIQ
        </span>

        {/* Credits badge */}
        <span style={{
          background: credits > 0 ? '#1A7A4A' : '#CF4500',
          color: '#fff', borderRadius: 999, padding: '3px 10px',
          fontSize: 11, fontWeight: 700, marginRight: 8,
        }}>
          {credits} credits
        </span>

        {/* Settings / logout toggle */}
        <button
          onClick={() => setShowSettings(v => !v)}
          title={showSettings ? 'Back' : 'Settings'}
          style={{
            background: showSettings ? '#E0DBD6' : 'none',
            border: 'none', borderRadius: 8, width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#555555', fontSize: 16,
          }}
        >
          {showSettings ? '←' : '⚙'}
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {/* Settings panel */}
        {showSettings ? (
          <div>
            <div style={{
              background: '#FCFBFA', border: '1px solid #E0DBD6',
              borderRadius: 16, padding: 16, marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, color: '#8A8785', marginBottom: 4 }}>Signed in as</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#141413' }}>{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', padding: '12px', fontSize: 13, fontWeight: 600,
                color: '#CF4500', background: '#FFF4EE',
                border: '1px solid #FFCFB8', borderRadius: 12,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            {/* Welcome banner for new users */}
            {isNewUser && <WelcomeBanner credits={credits} />}

            {/* Resume section */}
            {resume ? (
              <div style={{
                background: '#FCFBFA', border: '1px solid #E0DBD6',
                borderRadius: 16, padding: 16, marginBottom: 16,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#141413' }}>{resume.name}</div>
                <div style={{ fontSize: 12, color: '#555555', marginTop: 4 }}>
                  {resume.currentRole} · {resume.skills.length} skills
                </div>
                <label style={{ display: 'block', marginTop: 12, fontSize: 12, color: '#8A8785', cursor: 'pointer' }}>
                  Update resume
                  <input
                    type="file" accept=".pdf,.docx" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f) }}
                  />
                </label>
              </div>
            ) : (
              <label style={{
                display: 'block', background: '#FCFBFA',
                border: '1.5px dashed #E0DBD6', borderRadius: 16,
                padding: 24, textAlign: 'center', cursor: 'pointer', marginBottom: 16,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#141413' }}>Upload your resume</div>
                <div style={{ fontSize: 12, color: '#8A8785', marginTop: 4 }}>
                  PDF or DOCX · stays on your device
                </div>
                <input
                  type="file" accept=".pdf,.docx" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f) }}
                />
              </label>
            )}

            {/* Credits prompt */}
            {credits === 0 && <BuyCreditsCard />}

            {/* How-to hint */}
            {credits > 0 && (
              <div style={{
                background: '#FCFBFA', border: '1px solid #E0DBD6',
                borderRadius: 16, padding: 14,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#141413', marginBottom: 6 }}>
                  How it works
                </div>
                <div style={{ fontSize: 12, color: '#555555', lineHeight: 1.6 }}>
                  Navigate to any job listing on Naukri, LinkedIn, Indeed, Wellfound, or Instahyre
                  and ReferralIQ will automatically score the opportunity and surface recruiter insights.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Root popup component ─────────────────────────────────────────────────────
export function PopupApp() {
  const { status, checkSession } = useAuthStore()

  useEffect(() => { checkSession() }, [])

  if (status === 'checking')       return <LoadingScreen />
  if (status === 'unauthenticated') return <AuthScreen />
  return <MainApp />
}
