import { ExternalLink } from 'lucide-react'
import type { RecruiterData } from '@/types/enrichment'

interface Props { contact: RecruiterData; rank: number }

export function ContactCard({ contact, rank }: Props) {
  return (
    <div style={{ position: 'relative', background: '#FCFBFA', border: '1px solid #E0DBD6', borderRadius: 16, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ position: 'absolute', top: -8, left: -8, width: 20, height: 20, borderRadius: 999, background: '#CF4500', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {rank}
      </div>
      <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 50, background: '#EAE6E1', color: '#141413', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {contact.avatarInitials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#141413' }}>{contact.name}</div>
        <div style={{ fontSize: 13, color: '#555555', marginTop: 1 }}>{contact.role}</div>
        <div style={{ fontSize: 12, color: '#8A8785', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: contact.lastActiveDays <= 7 ? '#1A7A4A' : '#8A8785', display: 'block', flexShrink: 0 }} />
          {contact.lastActiveDays <= 7 ? `Active ${contact.lastActiveDays}d ago` : 'Less active'}
          {contact.openToMessages && ' · Open to DMs'}
          {contact.mutualConnections > 0 && ` · ${contact.mutualConnections} mutual`}
        </div>
      </div>
      {contact.linkedinUrl && (
        <a href={contact.linkedinUrl} target="_blank" rel="noreferrer"
           style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 50, border: '1.5px solid #E0DBD6', background: 'transparent', color: '#555555', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <ExternalLink size={16} strokeWidth={1.5} />
        </a>
      )}
    </div>
  )
}
