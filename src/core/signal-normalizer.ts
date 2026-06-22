import type { RawJobData, NormalizedJob, Site } from '@/types/job'

export function normalize(raw: RawJobData, site: Site): NormalizedJob {
  return {
    title:          raw.title         ?? 'Unknown Role',
    company:        raw.company       ?? 'Unknown Company',
    site,
    postedDaysAgo:  parsePostedDate(raw.posted),
    applicants:     parseApplicants(raw.applicants),
    salary:         raw.salary?.trim() ?? null,
    techStack:      parseTechStack(raw.techStack),
    responseRate:   parseResponseRate(raw.responseRate),
    isDirectApply:  detectDirectApply(raw.applyType),
    isRemote:       detectRemote(raw.remote),
    funding:        raw.funding?.trim() ?? null,
    teamSize:       raw.teamSize?.trim() ?? null,
    recruiterName:  raw.recruiterName?.trim() ?? null,
    description:    raw.description?.trim() ?? null,
    scrapedAt:      Date.now(),
  }
}

export function parsePostedDate(raw: string | null): number {
  if (!raw) return 30
  if (/today|just now|hour/i.test(raw)) return 0
  const days  = raw.match(/(\d+)\s*day/i)
  if (days?.[1])   return parseInt(days[1])
  const weeks = raw.match(/(\d+)\s*week/i)
  if (weeks?.[1])  return parseInt(weeks[1]) * 7
  const months = raw.match(/(\d+)\s*month/i)
  if (months?.[1]) return parseInt(months[1]) * 30
  return 30
}

export function parseApplicants(raw: string | null): number {
  if (!raw) return 0
  const kMatch = raw.match(/([\d.]+)k/i)
  if (kMatch?.[1]) return Math.round(parseFloat(kMatch[1]) * 1000)
  const numMatch = raw.match(/(\d+)/)
  return numMatch?.[1] ? parseInt(numMatch[1]) : 0
}

function parseTechStack(raw: string | null): string[] {
  if (!raw) return []
  return raw.split(/[,\n•·|]/).map(s => s.trim()).filter(Boolean)
}

function parseResponseRate(raw: string | null): 'high' | 'medium' | 'low' | null {
  if (!raw) return null
  const lower = raw.toLowerCase()
  if (lower.includes('high'))   return 'high'
  if (lower.includes('medium')) return 'medium'
  if (lower.includes('low'))    return 'low'
  return null
}

function detectDirectApply(raw: string | null): boolean {
  if (!raw) return true
  return !/external|company site/i.test(raw)
}

function detectRemote(raw: string | null): boolean {
  if (!raw) return false
  return /remote/i.test(raw)
}

export function matchResumeToJob(
  jobDescription: string | null,
  jobTechStack: string[],
  resumeSkills: string[],
): { matched: string[]; missing: string[]; partial: string[]; score: number } {
  const jdText   = (jobDescription ?? '').toLowerCase()
  const jobSkills = [
    ...jobTechStack,
    ...extractSkillsFromText(jdText),
  ].filter((v, i, a) => a.indexOf(v) === i)

  const matched: string[] = []
  const missing: string[] = []
  const partial: string[] = []

  for (const skill of jobSkills) {
    const skillLower = skill.toLowerCase()
    const resumeHas  = resumeSkills.some(r => r.toLowerCase() === skillLower)
    const resumePartial = !resumeHas && resumeSkills.some(r =>
      r.toLowerCase().includes(skillLower) || skillLower.includes(r.toLowerCase())
    )
    if (resumeHas)         matched.push(skill)
    else if (resumePartial) partial.push(skill)
    else                   missing.push(skill)
  }

  const total = matched.length + missing.length + partial.length
  const score = total === 0 ? 50 : Math.round(
    ((matched.length + partial.length * 0.5) / total) * 100
  )

  return { matched, missing, partial, score }
}

const COMMON_SKILLS = [
  'python', 'java', 'go', 'golang', 'typescript', 'javascript', 'react', 'node',
  'kafka', 'postgresql', 'mysql', 'mongodb', 'redis', 'docker', 'kubernetes',
  'aws', 'gcp', 'azure', 'grpc', 'rest', 'graphql', 'microservices', 'git',
]

function extractSkillsFromText(text: string): string[] {
  return COMMON_SKILLS.filter(s => text.includes(s))
}
