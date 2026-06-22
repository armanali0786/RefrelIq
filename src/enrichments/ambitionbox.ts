import type { EnrichmentData } from '@/types/enrichment'
import { logger } from '@/utils/logger'

export async function ambitionBoxEnrich(company: string): Promise<Partial<EnrichmentData>> {
  try {
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const response = await fetch(
      `https://www.ambitionbox.com/overview/${slug}-overview`,
      { credentials: 'omit' }
    )
    if (!response.ok) return {}
    const html = await response.text()
    const parser = new DOMParser()
    const doc    = parser.parseFromString(html, 'text/html')

    const ratingEl = doc.querySelector('.rating-score, [class*="ratingValue"]')
    const rating   = ratingEl ? parseFloat(ratingEl.textContent ?? '0') : null

    return rating !== null && rating > 0 ? { companyRating: rating } : {}
  } catch (err) {
    logger.warn('AmbitionBox enrichment failed:', err)
    return {}
  }
}
