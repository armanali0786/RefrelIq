import { useJobStore } from '@/store/useJobStore'
import { matchResumeToJob } from '@/core/signal-normalizer'

export function MatchTab() {
  const { currentJob, resume, score } = useJobStore()

  if (!resume) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <p style={{ fontSize: 14, color: '#555555' }}>Upload your resume to see your match score</p>
      </div>
    )
  }

  const match = matchResumeToJob(
    currentJob?.description ?? null,
    currentJob?.techStack ?? [],
    resume.skills,
  )

  const pct = score?.signals.match !== undefined
    ? Math.round(score.signals.match * 100)
    : match.score

  return (
    <div>
      <div style={{ background: '#FCFBFA', borderRadius: 24, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.44px', textTransform: 'uppercase', color: '#555555' }}>
          Your resume match
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 44, fontWeight: 600, color: '#141413', lineHeight: 1.1, marginTop: 6 }}>
          {pct}<span style={{ fontSize: 24 }}>%</span>
        </div>
        <div style={{ height: 8, background: '#E0DBD6', borderRadius: 999, marginTop: 14, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: '#1A7A4A', borderRadius: 999 }} />
        </div>
      </div>

      <SkillSection title="✓ Matched skills" color="#1A7A4A" skills={match.matched} bg="#DCFCE7" textColor="#166534" />
      <SkillSection title="✗ Missing" color="#C0392B" skills={match.missing} bg="#FEE2E2" textColor="#991B1B" />
      {match.partial.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.44px', textTransform: 'uppercase', color: '#854D0E', margin: '22px 0 10px' }}>~ Partial</div>
          <div style={{ background: '#FEF9C3', borderRadius: 16, padding: 14 }}>
            {match.partial.map(s => (
              <div key={s} style={{ fontSize: 13, fontWeight: 600, color: '#854D0E' }}>{s}</div>
            ))}
          </div>
        </>
      )}

      <button style={{ width: '100%', marginTop: 20, height: 42, background: 'transparent', color: '#141413', border: '1.5px solid #141413', borderRadius: 20, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
        Update my resume
      </button>
    </div>
  )
}

function SkillSection({ title, color, skills, bg, textColor }: { title: string; color: string; skills: string[]; bg: string; textColor: string }) {
  if (!skills.length) return null
  return (
    <>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.44px', textTransform: 'uppercase', color, margin: '22px 0 10px' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.map(s => (
          <span key={s} style={{ background: bg, color: textColor, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 600 }}>{s}</span>
        ))}
      </div>
    </>
  )
}
