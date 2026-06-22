export type ScoreBand = 'high' | 'medium' | 'low' | 'skip'

export interface SignalScores {
  timing:      number
  competition: number
  response:    number
  match:       number
  company:     number
  recruiter:   number
  funding:     number
}

export interface SignalDisplay {
  key:     keyof SignalScores
  label:   string
  value:   string
  score:   number
  color:   'green' | 'amber' | 'red' | 'neutral' | 'loading'
}

export interface OpportunityScore {
  score:    number
  band:     ScoreBand
  verdict:  string
  signals:  SignalScores
  weights:  Partial<SignalScores>
  partial:  boolean
}

export type OutreachApproach = 'referral' | 'linkedin_dm' | 'cold_email' | 'direct_apply'

export interface OutreachStep {
  text: string
  note: string
}

export interface OutreachStrategy {
  approach:   OutreachApproach
  primary:    { name: string; linkedinUrl?: string } | null
  email?:     string
  reasoning:  string
  steps:      OutreachStep[]
}
