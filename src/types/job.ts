export type Site = 'naukri' | 'linkedin' | 'indeed' | 'wellfound' | 'instahyre' | 'generic'

export interface RawJobData {
  title:          string | null
  company:        string | null
  posted:         string | null
  applicants:     string | null
  salary:         string | null
  responseRate:   string | null
  recruiterName:  string | null
  techStack:      string | null
  funding:        string | null
  teamSize:       string | null
  remote:         string | null
  description:    string | null
  applyType:      string | null
}

export interface NormalizedJob {
  title:          string
  company:        string
  site:           Site
  postedDaysAgo:  number
  applicants:     number
  salary:         string | null
  techStack:      string[]
  responseRate:   'high' | 'medium' | 'low' | null
  isDirectApply:  boolean
  isRemote:       boolean
  funding:        string | null
  teamSize:       string | null
  recruiterName:  string | null
  description:    string | null
  scrapedAt:      number
}

export interface ResumeData {
  name:        string
  currentRole: string
  yearsExp:    number
  skills:      string[]
  topSkills:   string[]
  education:   string
  companies:   string[]
}

export interface UserPreferences {
  weights: {
    timing:      number
    competition: number
    response:    number
    match:       number
    company:     number
    recruiter:   number
    funding:     number
  }
  activeSites:  Site[]
  panelCollapsed: boolean
  tone:         'professional' | 'casual' | 'concise'
}
