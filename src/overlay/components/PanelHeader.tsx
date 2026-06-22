import { X } from 'lucide-react'
import { useJobStore } from '@/store/useJobStore'

export function PanelHeader() {
  const { currentJob, setCollapsed } = useJobStore()
  const site = currentJob?.site?.toUpperCase() ?? 'DETECTING'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 50, background: '#141413',
        color: '#F3F0EE', fontSize: 13, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>R</div>
      <span style={{ fontSize: 16, fontWeight: 600, color: '#141413', letterSpacing: '-0.32px', flex: 1 }}>
        ReferralIQ
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#EAE6E1', borderRadius: 999, padding: '4px 10px',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.44px', color: '#141413',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: '#1A7A4A', display: 'block' }} />
        {site}
      </span>
      <button
        onClick={() => setCollapsed(true)}
        aria-label="Collapse"
        style={{
          width: 32, height: 32, borderRadius: 50, background: 'transparent',
          border: '1.5px solid #E0DBD6', color: '#555555',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  )
}
