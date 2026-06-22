import type { OutreachStrategy } from '@/types/scoring'

interface Props { strategy: OutreachStrategy }

export function StrategyPanel({ strategy }: Props) {
  return (
    <div style={{ background: '#F3F0EE', border: '1px solid #E0DBD6', borderRadius: 16, padding: 16, marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.44px', textTransform: 'uppercase', color: '#555555', display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: '#CF4500', display: 'block' }} />
        Recommended approach
      </div>
      {strategy.steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginTop: i === 0 ? 14 : 12 }}>
          <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 999, background: '#141413', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {i + 1}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 450, color: '#141413' }}>{step.text}</div>
            <div style={{ fontSize: 12, color: '#8A8785', marginTop: 2 }}>{step.note}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
