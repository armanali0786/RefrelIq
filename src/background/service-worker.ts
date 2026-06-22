import type { AppMessage } from '@/types/messages'
import { scoreOpportunity, scoreTiming, scoreCompetition } from '@/scoring/opportunity-scorer'
import { determineStrategy } from '@/scoring/strategy-engine'
import { enrich } from '@/core/enrichment-engine'
import { draftOutreachMessage } from '@/utils/llm-client'
import { cache } from '@/utils/cache'
import { jobCacheKey } from '@/utils/hash'
import { checkAndUpdateRegistry } from '@/utils/registry-updater'
import { DEFAULT_REGISTRY } from '@/core/scraper-registry'
import { SCORE_CACHE_TTL_MS, ENRICHMENT_CACHE_TTL_MS } from '@/constants/config'
import type { NormalizedJob } from '@/types/job'
import type { EnrichmentData } from '@/types/enrichment'

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    await chrome.storage.local.set({ scraper_registry: DEFAULT_REGISTRY, registry_version: 1 })
    await chrome.tabs.create({ url: chrome.runtime.getURL('popup/index.html') })
  }
  chrome.alarms.create('registry-check', { periodInMinutes: 1440 })
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'registry-check') {
    const stored = await cache.getRegistry()
    const updated = await checkAndUpdateRegistry(stored?.version ?? 0)
    if (updated) {
      const tabs = await chrome.tabs.query({})
      tabs.forEach(tab => {
        if (tab.id) chrome.tabs.sendMessage(tab.id, { type: 'REGISTRY_UPDATE', payload: updated })
      })
    }
  }
})

chrome.runtime.onMessage.addListener((
  message: AppMessage,
  sender,
  sendResponse,
) => {
  if (sender.id !== chrome.runtime.id) return

  if (message.type === 'SCRAPE_COMPLETE') {
    handleScrapeComplete(message.payload, sender.tab?.id)
    return
  }

  if (message.type === 'REQUEST_DRAFT') {
    handleDraftRequest(message.payload, sender.tab?.id)
    return
  }

  if (message.type === 'CHECK_PRO_STATUS') {
    cache.getProStatus().then(s =>
      sendResponse({ type: 'PRO_STATUS', payload: { active: s?.active ?? false } })
    )
    return true
  }
})

async function handleScrapeComplete(job: NormalizedJob, tabId?: number) {
  if (!tabId) return

  const cacheKey   = jobCacheKey(job.company, job.title, job.site)
  const cached     = await cache.getScore(cacheKey, SCORE_CACHE_TTL_MS)

  if (cached) {
    chrome.tabs.sendMessage(tabId, { type: 'SCORE_FINAL', payload: cached })
    return
  }

  const resumeData = await cache.getResume()
  const resumeMatch = resumeData ? 50 : 50

  const partialScore = scoreOpportunity(job, {}, resumeMatch, undefined, true)
  chrome.tabs.sendMessage(tabId, { type: 'SCORE_PARTIAL', payload: partialScore })

  const config = DEFAULT_REGISTRY[job.site] ?? DEFAULT_REGISTRY['generic']
  const enrichmentData: EnrichmentData = config
    ? await enrich(job, config.enrichments)
    : {}

  const fullScore = scoreOpportunity(job, enrichmentData, resumeMatch, undefined, false)
  await cache.setScore(cacheKey, fullScore)
  chrome.tabs.sendMessage(tabId, { type: 'SCORE_FINAL',      payload: fullScore })
  chrome.tabs.sendMessage(tabId, { type: 'ENRICHMENT_RESULT', payload: enrichmentData })

  const strategy = determineStrategy(enrichmentData)
  chrome.tabs.sendMessage(tabId, { type: 'STRATEGY_RESULT', payload: strategy })
}

async function handleDraftRequest(
  payload: Extract<AppMessage, { type: 'REQUEST_DRAFT' }>['payload'],
  tabId?: number,
) {
  if (!tabId) return
  try {
    const draft = await draftOutreachMessage(payload)
    chrome.tabs.sendMessage(tabId, { type: 'DRAFT_RESULT', payload: draft })
  } catch {
    chrome.tabs.sendMessage(tabId, { type: 'ERROR', payload: { code: 'DRAFT_FAILED', message: 'Message drafting is temporarily unavailable' } })
  }
}
