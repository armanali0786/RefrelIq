import { ScraperEngine } from '@/core/scraper-engine'
import { DEFAULT_REGISTRY } from '@/core/scraper-registry'
import { normalize } from '@/core/signal-normalizer'
import type { Site } from '@/types/job'
import type { SiteConfig } from '@/types/registry'
import type { AppMessage } from '@/types/messages'
import { SCRAPER_DEBOUNCE_MS } from '@/constants/config'

let engine: ScraperEngine | null = null
let mountedOverlay = false
let currentJobHash = ''

async function getRegistry() {
  try {
    const result = await chrome.storage.local.get('scraper_registry')
    return result['scraper_registry'] ?? DEFAULT_REGISTRY
  } catch {
    return DEFAULT_REGISTRY
  }
}

async function run() {
  const registry = await getRegistry()
  engine = new ScraperEngine(registry)

  const match = engine.getSiteConfig()
  if (!match) return

  const [, config] = match
  if (engine.isJobDetailPage(config)) {
    await processJobPage(config)
  }

  engine.watchNavigation(async (cfg) => {
    if (engine?.isJobDetailPage(cfg)) {
      await processJobPage(cfg)
    }
  })
}

async function processJobPage(config: SiteConfig) {
  if (!engine) return
  const raw = engine.scrape(config)
  const siteMatch = engine.getSiteConfig()
  if (!siteMatch) return

  const site = siteMatch[0].replace('.com', '').replace('.', '') as Site
  const job  = normalize(raw, site)
  const hash = `${job.company}-${job.title}`
  if (hash === currentJobHash) return
  currentJobHash = hash

  injectOverlay()
  chrome.runtime.sendMessage({ type: 'SCRAPE_COMPLETE', payload: job } satisfies AppMessage)
}

function injectOverlay() {
  if (mountedOverlay && document.getElementById('joblens-root')) return
  const script = document.createElement('script')
  script.src   = chrome.runtime.getURL('dist/content_scripts/overlay.js')
  script.type  = 'module'
  document.head.appendChild(script)
  mountedOverlay = true
}

chrome.runtime.onMessage.addListener((msg: AppMessage) => {
  if (msg.type === 'REGISTRY_UPDATE' && engine) {
    engine.updateRegistry(msg.payload)
  }
})

run().catch(console.error)
