import { useState, useEffect } from 'react'
import { cache } from '@/utils/cache'
import type { ResumeData } from '@/types/job'

export function PopupApp() {
  const [resume, setResume]       = useState<ResumeData | null>(null)
  const [proActive, setProActive] = useState(false)
  const [tab, setTab]             = useState<'main' | 'settings'>('main')

  useEffect(() => {
    cache.getResume().then(setResume)
    cache.getProStatus().then(s => setProActive(s?.active ?? false))
  }, [])

  const handleResumeUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1] ?? ''
      chrome.runtime.sendMessage({ type: 'PARSE_RESUME', payload: { base64, mimeType: file.type } })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ width: 360, background: '#F3F0EE', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E0DBD6' }}>
        <div style={{ width: 28, height: 28, borderRadius: 50, background: '#141413', color: '#F3F0EE', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>R</div>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#141413', marginLeft: 10, flex: 1 }}>ReferralIQ</span>
        {proActive && (
          <span style={{ background: '#CF4500', color: '#fff', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>PRO</span>
        )}
      </div>

      <div style={{ padding: 20 }}>
        {resume ? (
          <div style={{ background: '#FCFBFA', border: '1px solid #E0DBD6', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#141413' }}>{resume.name}</div>
            <div style={{ fontSize: 12, color: '#555555', marginTop: 4 }}>{resume.currentRole} · {resume.skills.length} skills</div>
            <label style={{ display: 'block', marginTop: 12, fontSize: 13, color: '#555555', cursor: 'pointer' }}>
              Update resume
              <input type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f) }} />
            </label>
          </div>
        ) : (
          <label style={{ display: 'block', background: '#FCFBFA', border: '1.5px dashed #E0DBD6', borderRadius: 16, padding: 24, textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#141413' }}>Upload your resume</div>
            <div style={{ fontSize: 12, color: '#8A8785', marginTop: 4 }}>PDF or DOCX · stays on your device</div>
            <input type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f) }} />
          </label>
        )}

        {!proActive && (
          <div style={{ background: '#141413', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#F3F0EE' }}>Upgrade to Pro</div>
            <div style={{ fontSize: 12, color: '#8A8785', marginTop: 4 }}>Unlimited recruiter intel · AI drafts</div>
            <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: '#CF4500' }}>₹299/mo</div>
          </div>
        )}
      </div>
    </div>
  )
}
