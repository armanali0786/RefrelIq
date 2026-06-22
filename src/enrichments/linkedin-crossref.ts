import type { EnrichmentData } from '@/types/enrichment'
import { logger } from '@/utils/logger'

export async function linkedInCrossRef(_company: string, _title: string): Promise<Partial<EnrichmentData>> {
  try {
    const recruiterCard = document.querySelector('.hirer-card__hirer-information')
    if (!recruiterCard) return {}
    const name = recruiterCard.querySelector('span[aria-hidden="true"]')?.textContent?.trim() ?? ''
    const role = recruiterCard.querySelector('.hirer-card__hirer-job-title')?.textContent?.trim() ?? ''
    if (!name) return {}
    return {
      recruiter: {
        name, role,
        linkedinUrl:       '',
        lastActiveDays:    3,
        openToMessages:    true,
        mutualConnections: 0,
        avatarInitials:    name.split(' ').map(p => p[0] ?? '').join('').slice(0,2).toUpperCase(),
      }
    }
  } catch (err) {
    logger.warn('LinkedIn crossref failed:', err)
    return {}
  }
}

export async function linkedInPeopleSearch(_company: string, _title: string): Promise<Partial<EnrichmentData>> {
  return {}
}

export async function getMutualConnections(_company: string): Promise<Partial<EnrichmentData>> {
  try {
    const mutualEls = document.querySelectorAll('.hirer-card__mutual-connections-text')
    if (!mutualEls.length) return {}
    const match = mutualEls[0]?.textContent?.match(/(d+)/)
    const count = match ? parseInt(match[1] ?? '0') : 0
    return count > 0 ? { mutualConnections: [] } : {}
  } catch {
    return {}
  }
}
