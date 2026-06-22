import { describe, it, expect } from 'vitest'
import { parsePostedDate, parseApplicants, matchResumeToJob } from '@/core/signal-normalizer'

describe('parsePostedDate', () => {
  it('parses "today" as 0', () => expect(parsePostedDate('Posted today')).toBe(0))
  it('parses "just now" as 0', () => expect(parsePostedDate('Just now')).toBe(0))
  it('parses "2 days ago" as 2', () => expect(parsePostedDate('2 days ago')).toBe(2))
  it('parses "3 weeks ago" as 21', () => expect(parsePostedDate('3 weeks ago')).toBe(21))
  it('parses "2 months ago" as 60', () => expect(parsePostedDate('2 months ago')).toBe(60))
  it('defaults to 30 for null', () => expect(parsePostedDate(null)).toBe(30))
  it('defaults to 30 for unknown', () => expect(parsePostedDate('Long time ago')).toBe(30))
})

describe('parseApplicants', () => {
  it('parses "142 applicants" as 142', () => expect(parseApplicants('142 applicants')).toBe(142))
  it('parses "1.2K applicants" as 1200', () => expect(parseApplicants('1.2K applicants')).toBe(1200))
  it('parses "Over 200 applicants" as 200', () => expect(parseApplicants('Over 200 applicants')).toBe(200))
  it('returns 0 for null', () => expect(parseApplicants(null)).toBe(0))
  it('returns 0 for non-numeric', () => expect(parseApplicants('Be the first')).toBe(0))
})

describe('matchResumeToJob', () => {
  const resumeSkills = ['Go', 'PostgreSQL', 'Docker', 'REST APIs']

  it('identifies matched skills', () => {
    const result = matchResumeToJob(null, ['Go', 'PostgreSQL', 'Kafka'], resumeSkills)
    expect(result.matched).toContain('Go')
    expect(result.matched).toContain('PostgreSQL')
  })

  it('identifies missing skills', () => {
    const result = matchResumeToJob(null, ['Go', 'Kafka', 'gRPC'], resumeSkills)
    expect(result.missing).toContain('Kafka')
  })

  it('returns a score between 0 and 100', () => {
    const result = matchResumeToJob(null, ['Go', 'Kafka'], resumeSkills)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it('returns 50 for empty job skills', () => {
    const result = matchResumeToJob(null, [], resumeSkills)
    expect(result.score).toBe(50)
  })
})
