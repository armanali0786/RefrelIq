import { useJobStore } from '@/store/useJobStore'
import { PanelHeader } from './PanelHeader'
import { TabBar } from './TabBar'
import { ScoreTab } from './ScoreTab'
import { RecruiterTab } from './RecruiterTab'
import { MatchTab } from './MatchTab'
import { Toast } from './Toast'
import { bandColor } from '@/scoring/opportunity-scorer'

export function PanelContainer() {
  const { collapsed, setCollapsed, activeTab, score, copied } = useJobStore()

  if (collapsed) {
    const bg = score ? bandColor(score.band) : '#141413'
    return (
      <button
        onClick={() => setCollapsed(false)}
        style={{
          position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)',
          width: 56, height: 56, borderRadius: 999, background: bg,
          border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 24px rgba(20,20,19,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2147483647,
        }}
      >
        {score ? `${score.score}%` : 'RIQ'}
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
      width: 360, maxHeight: '86vh', background: '#F3F0EE',
      borderRadius: 24, boxShadow: '0 4px 24px rgba(20,20,19,0.12)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 2147483647,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <PanelHeader />
      <TabBar />
      <div style={{ overflowY: 'auto', padding: 24, flex: 1 }}
           className="riq-scroll">
        {activeTab === 'score'     && <ScoreTab />}
        {activeTab === 'recruiter' && <RecruiterTab />}
        {activeTab === 'match'     && <MatchTab />}
      </div>
      {copied && <Toast message="Copied to clipboard" />}
    </div>
  )
}
