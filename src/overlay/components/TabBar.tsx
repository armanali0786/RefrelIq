import { useJobStore } from '@/store/useJobStore'
import type { CSSProperties } from 'react'

const TABS = [
  { key: 'score',     label: 'Score'     },
  { key: 'recruiter', label: 'Recruiter' },
  { key: 'match',     label: 'Match'     },
] as const

export function TabBar() {
  const { activeTab, setActiveTab } = useJobStore()
  const idx = TABS.findIndex(t => t.key === activeTab)

  return (
    <div style={{ position: 'relative', display: 'flex', padding: '0 8px', borderBottom: '1px solid #E0DBD6' }}>
      {TABS.map(tab => {
        const active = tab.key === activeTab
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, height: 48, background: 'transparent', border: 'none',
              cursor: 'pointer', fontSize: 14, letterSpacing: '-0.1px', padding: '0 8px',
              fontWeight: active ? 600 : 500, color: active ? '#141413' : '#555555',
            } satisfies CSSProperties}
          >
            {tab.label}
          </button>
        )
      })}
      <div style={{
        position: 'absolute', bottom: 0, height: 2, borderRadius: 999,
        background: '#CF4500', width: 114.67,
        left: 8 + idx * 114.67,
        transition: 'left 150ms cubic-bezier(0,0,0.2,1)',
      }} />
    </div>
  )
}
