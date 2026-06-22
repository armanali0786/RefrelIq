import { useJobStore } from '@/store/useJobStore'
import { ContactCard } from './ContactCard'
import { StrategyPanel } from './StrategyPanel'
import { MessageDraft } from './MessageDraft'
import { STRINGS } from '@/constants/strings'

export function RecruiterTab() {
  const { enrichment, strategy, isLoadingRecruiter, draftOpen, setDraftOpen, score } = useJobStore()

  if (isLoadingRecruiter) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#555555', fontSize: 14 }}>
        {STRINGS.recruiter.loading}
      </div>
    )
  }

  const contacts = [
    enrichment?.recruiter,
    ...(enrichment?.additionalContacts ?? []),
  ].filter(Boolean)

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.44px', textTransform: 'uppercase', color: '#555555', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: '#1A7A4A', display: 'block' }} />
        {STRINGS.recruiter.title}
      </div>

      {contacts.length === 0 ? (
        <div style={{ background: '#FCFBFA', border: '1px solid #E0DBD6', borderRadius: 16, padding: 16, textAlign: 'center', color: '#555555', fontSize: 14 }}>
          {STRINGS.recruiter.notFound}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {contacts.map((contact, i) => (
            <ContactCard key={contact!.name + i} contact={contact!} rank={i + 1} />
          ))}
        </div>
      )}

      {strategy && <StrategyPanel strategy={strategy} />}

      <button
        onClick={() => setDraftOpen(!draftOpen)}
        style={{
          width: '100%', marginTop: 16, height: 42, background: '#141413',
          color: '#F3F0EE', border: '1.5px solid #141413', borderRadius: 20,
          fontSize: 14, fontWeight: 500, letterSpacing: '-0.28px', cursor: 'pointer',
        }}
      >
        {STRINGS.recruiter.cta}
      </button>

      {draftOpen && <MessageDraft />}

      <div style={{ textAlign: 'center', fontSize: 12, color: '#8A8785', marginTop: 18 }}>
        {STRINGS.pro.freePlan} · 4 {STRINGS.pro.lookupCount}
      </div>
    </div>
  )
}
