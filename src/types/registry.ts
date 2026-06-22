import type { Site } from './job'
import type { EnrichmentKey } from './enrichment'

export type StrategyType = 'naukri' | 'linkedin' | 'startup' | 'instahyre' | 'generic'

export interface SelectorMap {
  title:          string
  company:        string
  posted?:        string
  applicants?:    string
  salary?:        string
  responseRate?:  string
  recruiterName?: string
  techStack?:     string
  funding?:       string
  teamSize?:      string
  remote?:        string
  description?:   string
  applyType?:     string
}

export interface SiteConfig {
  selectors:     SelectorMap
  enrichments:   EnrichmentKey[]
  strategy:      StrategyType
  listSelector?: string
  spaTrigger?:   string
}

export type ScraperRegistry = Partial<Record<string, SiteConfig>>
