import { describe, it, expect } from 'vitest'
import {
  scoreOpportunity,
  scoreTiming,
  scoreCompetition,
  scoreResponseRate,
  scoreRecruiter,
  scoreFunding,
  scoreToBand,
} from '@/scoring/opportunity-scorer'
import type { NormalizedJob } from '@/types/job'
import type { EnrichmentData } from '@/types/enrichment'

function mockJob(overrides: Partial<NormalizedJob> = {}): NormalizedJob {
  return {
    title:         'Backend Engineer',
    company:       'Razorpay',
    site:          'naukri',
    postedDaysAgo: 2,
    applicants:    142,
    salary:        null,
    techStack:     ['Go', 'Kafka'],
    responseRate:  'high',
    isDirectApply: true,
    isRemote:      false,
    funding:       null,
    teamSize:      null,
    recruiterName: null,
    description:   null,
    scrapedAt:     Date.now(),
    ...overrides,
  }
}

function mockEnrichment(overrides: Partial<EnrichmentData> = {}): EnrichmentData {
  return {
    companyRating: 4.2,
    responseRate:  'high',
    ...overrides,
  }
}

describe('scoreTiming', () => {
  it('scores 0 days as 1.0', () => expect(scoreTiming(0)).toBe(1))
  it('scores 15 days as 0.5', () => expect(scoreTiming(15)).toBe(0.5))
  it('scores 30+ days as 0', () => expect(scoreTiming(30)).toBe(0))
  it('clamps below 0', () => expect(scoreTiming(60)).toBe(0))
})

describe('scoreCompetition', () => {
  it('scores 0 applicants as 1.0', () => expect(scoreCompetition(0)).toBe(1))
  it('scores 250 applicants as 0.5', () => expect(scoreCompetition(250)).toBe(0.5))
  it('scores 500+ as 0', () => expect(scoreCompetition(500)).toBe(0))
})

describe('scoreResponseRate', () => {
  it('scores high as 1.0',   () => expect(scoreResponseRate('high')).toBe(1.0))
  it('scores medium as 0.6', () => expect(scoreResponseRate('medium')).toBe(0.6))
  it('scores low as 0.2',    () => expect(scoreResponseRate('low')).toBe(0.2))
  it('scores null as 0.5',   () => expect(scoreResponseRate(null)).toBe(0.5))
})

describe('scoreRecruiter', () => {
  it('returns 0.3 for null recruiter', () => expect(scoreRecruiter(null)).toBe(0.3))
  it('scores active open recruiter high', () => {
    const score = scoreRecruiter({
      name: 'A', role: 'R', linkedinUrl: '', avatarInitials: 'A',
      lastActiveDays: 2, openToMessages: true, mutualConnections: 1,
    })
    expect(score).toBeGreaterThanOrEqual(0.8)
  })
})

describe('scoreFunding', () => {
  it('scores null as neutral 0.5', () => expect(scoreFunding(null)).toBe(0.5))
  it('scores series b high', () => expect(scoreFunding('Series B')).toBeGreaterThan(0.7))
})

describe('scoreToBand', () => {
  it('maps 0.8 to high',   () => expect(scoreToBand(0.8)).toBe('high'))
  it('maps 0.6 to medium', () => expect(scoreToBand(0.6)).toBe('medium'))
  it('maps 0.3 to low',    () => expect(scoreToBand(0.3)).toBe('low'))
  it('maps 0.1 to skip',   () => expect(scoreToBand(0.1)).toBe('skip'))
})

describe('scoreOpportunity', () => {
  it('scores fresh job with high response rate above 75', () => {
    const job   = mockJob({ postedDaysAgo: 1, applicants: 50 })
    const enr   = mockEnrichment({ responseRate: 'high', companyRating: 4.5 })
    const result = scoreOpportunity(job, enr, 80)
    expect(result.score).toBeGreaterThan(70)
    expect(result.band).toBe('high')
  })

  it('scores stale job with many applicants below 50', () => {
    const job   = mockJob({ postedDaysAgo: 45, applicants: 700 })
    const result = scoreOpportunity(job, mockEnrichment(), 30)
    expect(result.score).toBeLessThan(50)
  })

  it('always returns integer score', () => {
    const result = scoreOpportunity(mockJob(), mockEnrichment(), 65)
    expect(Number.isInteger(result.score)).toBe(true)
  })

  it('score is between 0 and 100', () => {
    const result = scoreOpportunity(mockJob(), mockEnrichment(), 65)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it('partial flag is preserved', () => {
    const result = scoreOpportunity(mockJob(), mockEnrichment(), 50, undefined, true)
    expect(result.partial).toBe(true)
  })
})
