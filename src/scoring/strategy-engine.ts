import type { EnrichmentData } from '@/types/enrichment'
import type { OutreachStrategy, OutreachApproach } from '@/types/scoring'

export function determineStrategy(enrichment: EnrichmentData): OutreachStrategy {
  const { recruiter, mutualConnections, emailPattern } = enrichment

  if (mutualConnections && mutualConnections.length > 0) {
    const conn = mutualConnections[0] ?? null
    return {
      approach:  'referral',
      primary:   conn,
      reasoning: `You have ${mutualConnections.length} mutual connection(s). Referrals see 5× the response rate.`,
      steps: [
        { text: `Ask ${conn?.name ?? 'your connection'} for an introduction`, note: 'Mutual connection · referrals 5× response rate' },
        { text: 'Follow up with recruiter after referral is sent', note: 'Wait 3–5 days before following up' },
      ],
    }
  }

  if (recruiter && recruiter.openToMessages && recruiter.lastActiveDays <= 7) {
    return {
      approach:  'linkedin_dm',
      primary:   recruiter,
      reasoning: `${recruiter.name} is active (${recruiter.lastActiveDays}d ago) and open to messages.`,
      steps: [
        { text: `Send a personalized DM to ${recruiter.name} on LinkedIn`, note: 'Active and open to connect' },
        { text: 'Apply via job board after sending DM', note: 'Apply within 24h of reaching out' },
      ],
    }
  }

  if (emailPattern) {
    return {
      approach:  'cold_email',
      primary:   recruiter ?? null,
      email:     emailPattern,
      reasoning: 'Recruiter is not active on LinkedIn. Cold email has better visibility.',
      steps: [
        { text: `Email ${emailPattern}`, note: 'Subject: Re: [Job Title] – [Your Name]' },
        { text: 'Apply on job board same day', note: 'Increases your visibility' },
      ],
    }
  }

  return {
    approach:  'direct_apply',
    primary:   null,
    reasoning: 'No contact data available. Apply directly and track response.',
    steps: [
      { text: 'Apply on job board', note: 'Complete your profile for better visibility' },
      { text: 'Set a 7-day reminder to follow up', note: 'Check company LinkedIn page' },
    ],
  }
}

export function formatApproachLabel(approach: OutreachApproach): string {
  const labels: Record<OutreachApproach, string> = {
    referral:      'Referral path',
    linkedin_dm:   'LinkedIn DM path',
    cold_email:    'Cold email path',
    direct_apply:  'Direct apply',
  }
  return labels[approach]
}
