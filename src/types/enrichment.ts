export interface RecruiterData {
  name:              string
  role:              string
  linkedinUrl:       string
  lastActiveDays:    number
  openToMessages:    boolean
  mutualConnections: number
  avatarInitials:    string
}

export interface MutualConnection {
  name:       string
  linkedinUrl: string
}

export interface EnrichmentData {
  companyRating?:     number
  interviewRating?:   number
  workLifeBalance?:   number
  responseRate?:      'high' | 'medium' | 'low'
  recruiter?:         RecruiterData
  additionalContacts?: RecruiterData[]
  mutualConnections?: MutualConnection[]
  emailPattern?:      string
  funding?:           string
  teamSize?:          string
  crunchbaseUrl?:     string
}

export type EnrichmentKey =
  | 'ambitionbox'
  | 'linkedin_crossref'
  | 'linkedin_people'
  | 'mutual_connections'
  | 'crunchbase'
  | 'glassdoor_crossref'

export interface CachedScore {
  data:      import('./scoring').OpportunityScore
  timestamp: number
}

export interface CachedEnrichment {
  data:      EnrichmentData
  timestamp: number
}
