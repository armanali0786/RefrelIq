import { useJobStore } from '@/store/useJobStore'
import { ScoreGauge } from './ScoreGauge'
import { SignalRow } from './SignalRow'
import { bandColor } from '@/scoring/opportunity-scorer'

const SIGNAL_LABELS: Record<string, string> = {
  timing:      'Hiring activity',
  competition: 'Competition level',
  response:    'Company response rate',
  match:       'Your resume match',
  company:     'Company rating',
  recruiter:   'Recruiter activity',
  funding:     'Funding stage',
}

export function ScoreTab() {
  const { score, isLoadingScore, setActiveTab } = useJobStore()

  if (isLoadingScore || !score) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#555555', fontSize: 14 }}>
        Analyzing opportunity…
      </div>
    )
  }

  const signalEntries = Object.entries(score.signals).filter(([, v]) => v > 0 || true)
  const accentColor   = bandColor(score.band)

  return (
    <div>
      <div style={{ background: '#FCFBFA', borderRadius: 24, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ScoreGauge score={score.score} band={score.band} verdict={score.verdict} color={accentColor} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.44px', textTransform: 'uppercase', color: '#555555', margin: '24px 0 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: '#CF4500', display: 'block' }} />
        Signals
      </div>

      <div style={{ background: '#FCFBFA', borderRadius: 16, padding: '0 16px' }}>
        {signalEntries.map(([key, value], i) => (
          <SignalRow
            key={key}
            label={SIGNAL_LABELS[key] ?? key}
            score={value}
            isLast={i === signalEntries.length - 1}
          />
        ))}
      </div>

      {score.partial && (
        <p style={{ fontSize: 12, color: '#8A8785', margin: '12px 0 0', textAlign: 'center' }}>
          Some signals unavailable
        </p>
      )}

      <button
        onClick={() => setActiveTab('recruiter')}
        style={{
          width: '100%', marginTop: 20, height: 42, background: '#141413',
          color: '#F3F0EE', border: '1.5px solid #141413', borderRadius: 20,
          fontSize: 14, fontWeight: 500, letterSpacing: '-0.28px', cursor: 'pointer',
        }}
      >
        See who to contact
      </button>
    </div>
  )
}
