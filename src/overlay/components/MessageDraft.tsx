import { Copy, RefreshCw, Pencil } from 'lucide-react'
import { useJobStore } from '@/store/useJobStore'
import type { DraftMessageRequest } from '@/types/messages'

const CHAR_LIMIT = 300

export function MessageDraft() {
  const {
    draftMessage, isLoadingDraft, draftError, tone, setTone,
    copied, setCopied, currentJob, enrichment, resume,
    setLoadingDraft, setDraft, setDraftError,
  } = useJobStore()

  const recruiter = enrichment?.recruiter

  const requestDraft = () => {
    if (!currentJob || !recruiter) return
    setLoadingDraft(true)
    const payload: DraftMessageRequest = {
      jobTitle:      currentJob.title,
      company:       currentJob.company,
      recruiterName: recruiter.name,
      recruiterRole: recruiter.role,
      channel:       'linkedin_dm',
      userProfile: {
        name:        resume?.name        ?? 'Job Seeker',
        yearsExp:    resume?.yearsExp    ?? 2,
        currentRole: resume?.currentRole ?? 'Software Engineer',
        topSkills:   resume?.topSkills   ?? [],
      },
      tone,
    }
    chrome.runtime.sendMessage({ type: 'REQUEST_DRAFT', payload })
  }

  const doCopy = () => {
    if (!draftMessage) return
    navigator.clipboard.writeText(draftMessage).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1900)
  }

  const len   = draftMessage?.length ?? 0
  const ratio = len / CHAR_LIMIT
  const charColor = ratio > 1 ? '#C0392B' : ratio > 0.9 ? '#B45309' : '#8A8785'

  if (!draftMessage && !isLoadingDraft) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #E0DBD6', borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#141413' }}>
          Draft a message to {recruiter?.name ?? 'recruiter'}
        </div>
        <ToneSelector tone={tone} setTone={setTone} />
        {draftError && <p style={{ fontSize: 12, color: '#C0392B', marginTop: 8 }}>{draftError}</p>}
        <button onClick={requestDraft} style={{ width: '100%', marginTop: 12, height: 36, background: '#141413', color: '#F3F0EE', border: 'none', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Generate
        </button>
      </div>
    )
  }

  if (isLoadingDraft) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #E0DBD6', borderRadius: 16, padding: 16, marginTop: 16, textAlign: 'center', color: '#555555', fontSize: 14 }}>
        Drafting your message…
      </div>
    )
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E0DBD6', borderRadius: 16, padding: 16, marginTop: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#141413' }}>
        Your LinkedIn DM to {recruiter?.name ?? 'Recruiter'}
      </div>
      <ToneSelector tone={tone} setTone={(t) => { setTone(t); setDraft(null) }} />
      <div style={{ height: 1, background: '#E0DBD6', margin: '12px 0' }} />
      <p style={{ margin: 0, fontSize: 14, fontWeight: 450, lineHeight: '20px', color: '#141413' }}>{draftMessage}</p>
      <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, marginTop: 10, color: charColor }}>
        {len} / {CHAR_LIMIT}
      </div>
      <div style={{ height: 1, background: '#E0DBD6', margin: '10px 0' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <GhostBtn icon={<Copy size={16} strokeWidth={1.5} />} label={copied ? 'Copied' : 'Copy'} onClick={doCopy} />
        <GhostBtn icon={<RefreshCw size={16} strokeWidth={1.5} />} label="Regenerate" onClick={() => { setDraft(null); requestDraft() }} />
        <GhostBtn icon={<Pencil size={16} strokeWidth={1.5} />} label="Edit" onClick={() => {}} />
      </div>
    </div>
  )
}

function ToneSelector({ tone, setTone }: { tone: string; setTone: (t: 'professional' | 'casual' | 'concise') => void }) {
  const tones = [
    { key: 'casual'       as const, label: 'Casual' },
    { key: 'professional' as const, label: 'Formal' },
    { key: 'concise'      as const, label: 'Concise' },
  ]
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 12, background: '#EAE6E1', borderRadius: 999, padding: 3 }}>
      {tones.map(t => (
        <button key={t.key} onClick={() => setTone(t.key)} style={{
          flex: 1, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 600,
          background: tone === t.key ? '#FCFBFA' : 'transparent',
          color: tone === t.key ? '#141413' : '#555555',
          boxShadow: tone === t.key ? '0 1px 2px rgba(20,20,19,0.10)' : 'none',
        }}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

function GhostBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 6, height: 34, background: 'transparent', border: 'none',
      color: '#555555', fontSize: 13, fontWeight: 450, cursor: 'pointer',
    }}>
      {icon}{label}
    </button>
  )
}
