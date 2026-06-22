import type { NormalizedJob, ResumeData } from './job'
import type { OpportunityScore, OutreachStrategy } from './scoring'
import type { EnrichmentData } from './enrichment'
import type { ScraperRegistry } from './registry'

export interface DraftMessageRequest {
  jobTitle:        string
  company:         string
  recruiterName:   string
  recruiterRole:   string
  channel:         'linkedin_dm' | 'cold_email' | 'referral_request'
  userProfile: {
    name:        string
    yearsExp:    number
    currentRole: string
    topSkills:   string[]
  }
  mutualConnection?: string
  tone:            'professional' | 'casual' | 'concise'
}

export type AppMessage =
  | { type: 'SCRAPE_COMPLETE';      payload: NormalizedJob }
  | { type: 'REQUEST_SCORE';        payload: NormalizedJob }
  | { type: 'REQUEST_ENRICHMENT';   payload: { company: string; site: string } }
  | { type: 'REQUEST_DRAFT';        payload: DraftMessageRequest }
  | { type: 'PARSE_RESUME';         payload: { base64: string; mimeType: string } }
  | { type: 'CHECK_PRO_STATUS';     payload: null }
  | { type: 'SCORE_PARTIAL';        payload: OpportunityScore }
  | { type: 'SCORE_FINAL';          payload: OpportunityScore }
  | { type: 'ENRICHMENT_RESULT';    payload: EnrichmentData }
  | { type: 'STRATEGY_RESULT';      payload: OutreachStrategy }
  | { type: 'DRAFT_RESULT';         payload: string }
  | { type: 'RESUME_PARSED';        payload: ResumeData }
  | { type: 'PRO_STATUS';           payload: { active: boolean } }
  | { type: 'REGISTRY_UPDATE';      payload: ScraperRegistry }
  | { type: 'ERROR';                payload: { code: string; message: string } }
