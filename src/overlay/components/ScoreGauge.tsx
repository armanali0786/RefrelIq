import type { ScoreBand } from '@/types/scoring'

interface Props {
  score:   number
  band:    ScoreBand
  verdict: string
  color:   string
}

export function ScoreGauge({ score, verdict, color }: Props) {
  const r          = 84
  const circumference = 2 * Math.PI * r
  const offset     = circumference * (1 - score / 100)

  return (
    <>
      <div style={{ position: 'relative', width: 200, height: 200 }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={r} fill="none" stroke="#E0DBD6" strokeWidth="10" />
          <circle
            cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" transform="rotate(-90 100 100)"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 800ms ease-out' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 44, fontWeight: 600, color: '#141413', lineHeight: 1 }}>
            {score}<span style={{ fontSize: 24 }}>%</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.44px', textTransform: 'uppercase', color: '#555555', marginTop: 6 }}>
            Opportunity score
          </div>
        </div>
      </div>
      <span style={{
        background: color, color: '#fff', borderRadius: 999,
        padding: '5px 16px', fontSize: 13, fontWeight: 600, marginTop: 8,
      }}>
        {verdict}
      </span>
    </>
  )
}
