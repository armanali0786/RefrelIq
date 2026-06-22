import { describe, it, expect } from 'vitest'
import { determineStrategy } from '@/scoring/strategy-engine'
import type { EnrichmentData } from '@/types/enrichment'

const recruiterActive: EnrichmentData['recruiter'] = {
  name: 'Ananya Sharma', role: 'Technical Recruiter',
  linkedinUrl: 'https://linkedin.com/in/ananya',
  lastActiveDays: 2, openToMessages: true,
  mutualConnections: 0, avatarInitials: 'AS',
}

describe('determineStrategy', () => {
  it('recommends referral when mutual connections exist', () => {
    const strategy = determineStrategy({
      mutualConnections: [{ name: 'Rahul M', linkedinUrl: 'x' }],
    })
    expect(strategy.approach).toBe('referral')
  })

  it('recommends linkedin_dm when recruiter is active and open', () => {
    const strategy = determineStrategy({ recruiter: recruiterActive })
    expect(strategy.approach).toBe('linkedin_dm')
  })

  it('recommends cold_email when email pattern exists', () => {
    const strategy = determineStrategy({
      recruiter: { ...recruiterActive, lastActiveDays: 30, openToMessages: false },
      emailPattern: 'ananya@razorpay.com',
    })
    expect(strategy.approach).toBe('cold_email')
  })

  it('falls back to direct_apply with no data', () => {
    const strategy = determineStrategy({})
    expect(strategy.approach).toBe('direct_apply')
  })

  it('always returns at least one step', () => {
    const strategy = determineStrategy({})
    expect(strategy.steps.length).toBeGreaterThan(0)
  })
})
