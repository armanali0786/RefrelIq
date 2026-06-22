import type { RawJobData } from '@/types/job'
import type { SiteConfig, ScraperRegistry } from '@/types/registry'
import { logger } from '@/utils/logger'
import { OBSERVER_DEBOUNCE_MS } from '@/constants/config'

export class ScraperEngine {
  private registry: ScraperRegistry
  private observer: MutationObserver | null = null
  private lastUrl = ''
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor(registry: ScraperRegistry) {
    this.registry = registry
  }

  updateRegistry(registry: ScraperRegistry): void {
    this.registry = registry
  }

  getSiteConfig(): [string, SiteConfig] | null {
    const url = window.location.hostname + window.location.pathname
    for (const [domain, config] of Object.entries(this.registry)) {
      if (config && url.includes(domain)) return [domain, config]
    }
    return null
  }

  isJobDetailPage(config: SiteConfig): boolean {
    if (!config.spaTrigger) return true
    return document.querySelector(config.spaTrigger) !== null
  }

  scrape(config: SiteConfig): RawJobData {
    const data: Partial<RawJobData> = {}
    for (const [field, selector] of Object.entries(config.selectors)) {
      try {
        const el = document.querySelector(selector as string)
        ;(data as Record<string, string | null>)[field] = el?.textContent?.trim() ?? null
      } catch (err) {
        logger.warn(`Selector miss: ${field} (${selector})`, err)
        ;(data as Record<string, string | null>)[field] = null
      }
    }
    return {
      title:         data.title         ?? null,
      company:       data.company       ?? null,
      posted:        data.posted        ?? null,
      applicants:    data.applicants    ?? null,
      salary:        data.salary        ?? null,
      responseRate:  data.responseRate  ?? null,
      recruiterName: data.recruiterName ?? null,
      techStack:     data.techStack     ?? null,
      funding:       data.funding       ?? null,
      teamSize:      data.teamSize      ?? null,
      remote:        data.remote        ?? null,
      description:   data.description   ?? null,
      applyType:     data.applyType     ?? null,
    }
  }

  getJobCards(config: SiteConfig): Element[] {
    if (!config.listSelector) return []
    return Array.from(document.querySelectorAll(config.listSelector))
  }

  watchNavigation(callback: (config: SiteConfig) => void): void {
    this.observer = new MutationObserver(() => {
      const currentUrl = window.location.href
      if (currentUrl === this.lastUrl) return
      this.lastUrl = currentUrl

      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        const match = this.getSiteConfig()
        if (match) callback(match[1])
      }, OBSERVER_DEBOUNCE_MS)
    })

    this.observer.observe(document.body, { subtree: true, childList: true })
  }

  destroy(): void {
    this.observer?.disconnect()
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
  }
}
