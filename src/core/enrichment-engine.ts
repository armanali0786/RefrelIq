import type { NormalizedJob } from '@/types/job'
import type { EnrichmentData, EnrichmentKey } from '@/types/enrichment'
import { logger } from '@/utils/logger'
import { ENRICHMENT_TIMEOUT_MS } from '@/constants/config'

type EnrichFn = (job: NormalizedJob) => Promise<Partial<EnrichmentData>>

const ENRICHMENT_HANDLERS: Record<EnrichmentKey, EnrichFn> = {
  ambitionbox:       async (job) => {
    try {
      const { ambitionBoxEnrich } = await import('@/enrichments/ambitionbox')
      return ambitionBoxEnrich(job.company)
    } catch { return {} }
  },
  linkedin_crossref: async (job) => {
    try {
      const { linkedInCrossRef } = await import('@/enrichments/linkedin-crossref')
      return linkedInCrossRef(job.company, job.title)
    } catch { return {} }
  },
  linkedin_people:   async (job) => {
    try {
      const { linkedInPeopleSearch } = await import('@/enrichments/linkedin-crossref')
      return linkedInPeopleSearch(job.company, job.title)
    } catch { return {} }
  },
  mutual_connections: async (job) => {
    try {
      const { getMutualConnections } = await import('@/enrichments/linkedin-crossref')
      return getMutualConnections(job.company)
    } catch { return {} }
  },
  crunchbase: async (job) => {
    try {
      const { crunchbaseEnrich } = await import('@/enrichments/crunchbase')
      return crunchbaseEnrich(job.company)
    } catch { return {} }
  },
  glassdoor_crossref: async (job) => {
    try {
      const { glassdoorEnrich } = await import('@/enrichments/glassdoor')
      return glassdoorEnrich(job.company)
    } catch { return {} }
  },
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Enrichment timeout')), ms)
    ),
  ])
}

export async function enrich(
  job: NormalizedJob,
  keys: EnrichmentKey[],
): Promise<EnrichmentData> {
  const results = await Promise.allSettled(
    keys.map(key => withTimeout(ENRICHMENT_HANDLERS[key](job), ENRICHMENT_TIMEOUT_MS))
  )

  return results.reduce((acc, result, i) => {
    if (result.status === 'fulfilled') return { ...acc, ...result.value }
    logger.warn(`Enrichment ${keys[i]} failed:`, result.reason)
    return acc
  }, {} as EnrichmentData)
}
