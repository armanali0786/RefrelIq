import type { NormalizedJob, Site } from '@/types/job'
import type { EnrichmentData } from '@/types/enrichment'
import type { OpportunityScore, ScoreBand, SignalScores } from '@/types/scoring'

interface SiteWeights {
  timing:      number
  competition: number
  response:    number
  match:       number
  company:     number
  recruiter:   number
  funding:     number
}

const SITE_WEIGHTS: Record<Site, SiteWeights> = {
  naukri:    { timing:0.20, competition:0.20, response:0.25, match:0.15, company:0.20, recruiter:0.00, funding:0.00 },
  linkedin:  { timing:0.15, competition:0.15, response:0.20, match:0.20, company:0.00, recruiter:0.30, funding:0.00 },
  wellfound: { timing:0.15, competition:0.10, response:0.10, match:0.20, company:0.00, recruiter:0.15, funding:0.30 },
  indeed:    { timing:0.25, competition:0.25, response:0.20, match:0.30, company:0.00, recruiter:0.00, funding:0.00 },
  instahyre: { timing:0.20, competition:0.20, response:0.20, match:0.25, company:0.15, recruiter:0.00, funding:0.00 },
  generic:   { timing:0.25, competition:0.25, response:0.20, match:0.30, company:0.00, recruiter:0.00, funding:0.00 },
}

export function scoreOpportunity(
  job: NormalizedJob,
  enrichment: EnrichmentData,
  resumeMatchScore: number,
  customWeights?: Partial<SiteWeights>,
  isPartial = false,
): OpportunityScore {
  const weights: SiteWeights = { ...SITE_WEIGHTS[job.site], ...customWeights }

  const signals: SignalScores = {
    timing:      scoreTiming(job.postedDaysAgo),
    competition: scoreCompetition(job.applicants),
    response:    scoreResponseRate(job.responseRate ?? enrichment.responseRate ?? null),
    match:       resumeMatchScore / 100,
    company:     scoreCompany(enrichment.companyRating ?? null),
    recruiter:   scoreRecruiter(enrichment.recruiter ?? null),
    funding:     scoreFunding(job.funding ?? enrichment.funding ?? null),
  }

  const total = (Object.keys(weights) as (keyof SiteWeights)[])
    .reduce((sum, key) => sum + signals[key] * weights[key], 0)

  const score = Math.round(total * 100)

  return { score, band: scoreToBand(total), verdict: scoreToVerdict(total), signals, weights, partial: isPartial }
}

export const scoreTiming      = (days: number)            => Math.max(0, 1 - days / 30)
export const scoreCompetition = (count: number)           => Math.max(0, 1 - count / 500)
export const scoreCompany     = (rating: number | null)   => rating !== null ? rating / 5 : 0.5
export const scoreResponseRate = (rate: string | null): number => {
  const map: Record<string, number> = { high: 1.0, medium: 0.6, low: 0.2 }
  return map[rate ?? ''] ?? 0.5
}

export function scoreRecruiter(recruiter: EnrichmentData['recruiter'] | null): number {
  if (!recruiter) return 0.3
  let s = 0
  if (recruiter.lastActiveDays <= 3)    s += 0.4
  else if (recruiter.lastActiveDays <= 7) s += 0.2
  if (recruiter.openToMessages)          s += 0.2
  if (recruiter.mutualConnections > 0)   s += 0.2
  return Math.min(s, 1)
}

export function scoreFunding(stage: string | null): number {
  const stages: Record<string, number> = {
    'seed': 0.5, 'pre-seed': 0.4, 'series a': 0.7, 'series b': 0.8,
    'series c': 0.85, 'series d': 0.9, 'public': 0.7, 'ipo': 0.7,
  }
  const key = stage?.toLowerCase() ?? ''
  return stages[key] ?? 0.5
}

export function scoreToBand(score: number): ScoreBand {
  if (score >= 0.75) return 'high'
  if (score >= 0.50) return 'medium'
  if (score >= 0.25) return 'low'
  return 'skip'
}

function scoreToVerdict(score: number): string {
  if (score >= 0.75) return 'Apply now'
  if (score >= 0.50) return 'Worth considering'
  if (score >= 0.25) return 'Low priority'
  return 'Skip'
}

export function bandColor(band: ScoreBand): string {
  const colors: Record<ScoreBand, string> = {
    high:   '#1A7A4A',
    medium: '#B45309',
    low:    '#C0392B',
    skip:   '#8A8785',
  }
  return colors[band]
}
