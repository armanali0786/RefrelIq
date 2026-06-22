import type { DraftMessageRequest } from '@/types/messages'
import { BACKEND_URL, DRAFT_TIMEOUT_MS } from '@/constants/config'
import { logger } from './logger'

export async function draftOutreachMessage(req: DraftMessageRequest): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DRAFT_TIMEOUT_MS)

  try {
    const res = await fetch(`${BACKEND_URL}/api/draft-message`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(buildClaudePayload(req)),
      signal:  controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json() as { content: Array<{ text: string }> }
    return data.content[0]?.text ?? ''
  } catch (err) {
    clearTimeout(timer)
    logger.error('Draft message failed:', err)
    throw err
  }
}

function buildClaudePayload(req: DraftMessageRequest) {
  const CHANNEL_GUIDE: Record<DraftMessageRequest['channel'], string> = {
    linkedin_dm:       'Write a LinkedIn DM. Max 300 characters. Punchy and direct.',
    cold_email:        'Write a cold email body. Max 150 words. No subject line.',
    referral_request:  'Write a referral request to a mutual connection. Friendly tone.',
  }

  const userPrompt = `
Draft a ${req.channel} message for this situation:

Job: ${req.jobTitle} at ${req.company}
Contact: ${req.recruiterName} (${req.recruiterRole})
${req.mutualConnection ? `Mutual connection: ${req.mutualConnection}` : ''}

Sender:
- Name: ${req.userProfile.name}
- Current: ${req.userProfile.currentRole} (${req.userProfile.yearsExp} yrs exp)
- Top skills: ${req.userProfile.topSkills.join(', ')}

Tone: ${req.tone}
${CHANNEL_GUIDE[req.channel]}
  `.trim()

  return {
    model:      'claude-sonnet-4-6',
    max_tokens: 500,
    system:     `You are an expert job search coach helping craft personalized outreach messages.
Your messages are specific to the role and company, brief, human and warm — never a template.
Return only the message text. No subject line unless asked. No preamble.`,
    messages:   [{ role: 'user', content: userPrompt }],
  }
}

export async function parseResumeWithClaude(
  base64: string,
  mimeType: string,
): Promise<unknown> {
  const res = await fetch(`${BACKEND_URL}/api/parse-resume`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ base64, mimeType }),
  })
  if (!res.ok) throw new Error(`Resume parse failed: ${res.status}`)
  return res.json()
}
