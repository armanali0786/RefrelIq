interface Props {
  label:  string
  score:  number
  isLast: boolean
}

function scoreToLabel(score: number): string {
  if (score >= 0.8) return 'High'
  if (score >= 0.5) return 'Medium'
  return 'Low'
}

function scoreToColor(score: number): string {
  if (score >= 0.7) return '#1A7A4A'
  if (score >= 0.5) return '#B45309'
  return '#8A8785'
}

export function SignalRow({ label, score, isLast }: Props) {
  const color = scoreToColor(score)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 44, borderBottom: isLast ? 'none' : '1px solid #E0DBD6',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 450, color: '#141413' }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: color, display: 'block', flexShrink: 0 }} />
        {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#141413' }}>
        {scoreToLabel(score)}
      </span>
    </div>
  )
}
