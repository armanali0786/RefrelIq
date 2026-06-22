import type { OpportunityScore } from '@/types/scoring'
import type { EnrichmentData } from '@/types/enrichment'
import type { ScraperRegistry } from '@/types/registry'
import type { ResumeData, UserPreferences, Site } from '@/types/job'

interface CacheEntry<T> { data: T; timestamp: number }

async function get<T>(key: string): Promise<CacheEntry<T> | null> {
  const result = await chrome.storage.local.get(key)
  return (result[key] as CacheEntry<T>) ?? null
}

async function set<T>(key: string, data: T): Promise<void> {
  await chrome.storage.local.set({ [key]: { data, timestamp: Date.now() } })
}

async function getWithTTL<T>(key: string, ttlMs: number): Promise<T | null> {
  const entry = await get<T>(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > ttlMs) return null
  return entry.data
}

export const cache = {
  async getScore(key: string, ttlMs: number): Promise<OpportunityScore | null> {
    return getWithTTL<OpportunityScore>(key, ttlMs)
  },
  async setScore(key: string, score: OpportunityScore): Promise<void> {
    return set(key, score)
  },
  async getEnrichment(key: string, ttlMs: number): Promise<EnrichmentData | null> {
    return getWithTTL<EnrichmentData>(key, ttlMs)
  },
  async setEnrichment(key: string, data: EnrichmentData): Promise<void> {
    return set(key, data)
  },
  async getRegistry(): Promise<{ data: ScraperRegistry; version: number } | null> {
    const result = await chrome.storage.local.get(['scraper_registry', 'registry_version'])
    if (!result['scraper_registry']) return null
    return {
      data:    result['scraper_registry'] as ScraperRegistry,
      version: (result['registry_version'] as number) ?? 0,
    }
  },
  async setRegistry(data: ScraperRegistry, version: number): Promise<void> {
    await chrome.storage.local.set({ scraper_registry: data, registry_version: version })
  },
  async getResume(): Promise<ResumeData | null> {
    const result = await chrome.storage.local.get('resume_data')
    return (result['resume_data'] as ResumeData) ?? null
  },
  async setResume(data: ResumeData): Promise<void> {
    await chrome.storage.local.set({ resume_data: data })
  },
  async getPreferences(): Promise<UserPreferences | null> {
    const result = await chrome.storage.local.get('user_preferences')
    return (result['user_preferences'] as UserPreferences) ?? null
  },
  async setPreferences(prefs: UserPreferences): Promise<void> {
    await chrome.storage.local.set({ user_preferences: prefs })
  },
  async getProStatus(): Promise<{ active: boolean; expiresAt: number } | null> {
    const result = await chrome.storage.local.get('pro_status')
    return (result['pro_status'] as { active: boolean; expiresAt: number }) ?? null
  },
  async setProStatus(status: { active: boolean; expiresAt: number }): Promise<void> {
    await chrome.storage.local.set({ pro_status: status })
  },
  async getOnboardingComplete(): Promise<boolean> {
    const result = await chrome.storage.local.get('onboarding_complete')
    return (result['onboarding_complete'] as boolean) ?? false
  },
  async setOnboardingComplete(): Promise<void> {
    await chrome.storage.local.set({ onboarding_complete: true })
  },
}
