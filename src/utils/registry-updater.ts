import type { ScraperRegistry } from '@/types/registry'
import { cache } from './cache'
import { logger } from './logger'
import { REGISTRY_CDN_URL, REGISTRY_VERSION_URL } from '@/constants/config'

export async function checkAndUpdateRegistry(currentVersion: number): Promise<ScraperRegistry | null> {
  try {
    const vRes  = await fetch(REGISTRY_VERSION_URL)
    const vData = await vRes.json() as { version: number }
    if (vData.version <= currentVersion) return null

    const rRes  = await fetch(REGISTRY_CDN_URL)
    const newRegistry = await rRes.json() as ScraperRegistry
    await cache.setRegistry(newRegistry, vData.version)
    logger.log(`Registry updated to v${vData.version}`)
    return newRegistry
  } catch (err) {
    logger.warn('Registry update failed:', err)
    return null
  }
}
