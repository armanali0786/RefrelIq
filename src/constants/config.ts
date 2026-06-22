export const PANEL_WIDTH = 360
export const SCORE_CACHE_TTL_MS        = 6 * 60 * 60 * 1000   // 6 hours
export const RECRUITER_CACHE_TTL_MS    = 24 * 60 * 60 * 1000  // 24 hours
export const ENRICHMENT_CACHE_TTL_MS   = 7 * 24 * 60 * 60 * 1000  // 7 days
export const REGISTRY_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours
export const ENRICHMENT_TIMEOUT_MS     = 8000
export const DRAFT_TIMEOUT_MS          = 15000
export const SCRAPER_DEBOUNCE_MS       = 500
export const OBSERVER_DEBOUNCE_MS      = 300

export const FREE_TIER_RECRUITER_LOOKUPS = 5
export const FREE_TIER_DRAFTS_PER_DAY   = 5

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'https://joblens-api.workers.dev'

export const REGISTRY_CDN_URL = `${BACKEND_URL}/registry/latest.json`
export const REGISTRY_VERSION_URL = `${BACKEND_URL}/registry/version.json`

export const SCORE_BANDS = {
  high:   { min: 75, label: 'Apply now',        color: '#1A7A4A' },
  medium: { min: 50, label: 'Worth considering', color: '#B45309' },
  low:    { min: 25, label: 'Low priority',      color: '#C0392B' },
  skip:   { min: 0,  label: 'Skip',              color: '#8A8785' },
} as const
