import type { ScraperRegistry } from '@/types/registry'

export const DEFAULT_REGISTRY: ScraperRegistry = {
  'naukri.com': {
    selectors: {
      title:         '.jd-header-title',
      company:       '.jd-header-comp-name',
      posted:        '.job-posted-date',
      applicants:    '.jobs-applicants',
      salary:        '.salary-estimate',
      responseRate:  '.company-rating span',
      recruiterName: '.jd-stats span',
      description:   '#job-description',
    },
    enrichments:  ['ambitionbox', 'linkedin_crossref'],
    strategy:     'naukri',
    listSelector: '.jobTuple',
    spaTrigger:   '.jd-header-title',
  },
  'linkedin.com': {
    selectors: {
      // LinkedIn updates class names frequently — ordered from most to least specific
      title:      [
        '.job-details-jobs-unified-top-card__job-title h1',
        '.jobs-unified-top-card__job-title h1',
        '.t-24.job-details-jobs-unified-top-card__job-title',
        'h1.t-24.t-bold',
      ].join(', '),
      company:    [
        '.job-details-jobs-unified-top-card__company-name a',
        '.jobs-unified-top-card__company-name a',
        '.job-details-jobs-unified-top-card__company-name',
      ].join(', '),
      posted:     [
        '.job-details-jobs-unified-top-card__posted-date',
        '.jobs-unified-top-card__posted-date',
        'span.tvm__text--neutral',
      ].join(', '),
      applicants: [
        '.jobs-unified-top-card__applicant-count',
        '.job-details-jobs-unified-top-card__applicant-count',
        'span.tvm__text--positive',
      ].join(', '),
      remote:     [
        '.job-details-jobs-unified-top-card__workplace-type',
        '.jobs-unified-top-card__workplace-type',
        '.job-details-preference-bubble',
      ].join(', '),
      description: '#job-details',
    },
    enrichments:  ['linkedin_people', 'mutual_connections'],
    strategy:     'linkedin',
    listSelector: '.job-card-container',
    spaTrigger:   [
      '.job-details-jobs-unified-top-card__job-title h1',
      '.jobs-unified-top-card__job-title h1',
      'h1.t-24.t-bold',
    ].join(', '),
  },
  'indeed.com': {
    selectors: {
      title:       '[data-testid="jobsearch-JobInfoHeader-title"]',
      company:     '[data-testid="inlineHeader-companyName"]',
      posted:      '[data-testid="job-age-label"]',
      salary:      '[data-testid="job-salary-text"]',
      description: '#jobDescriptionText',
      remote:      '[data-testid="remote-badge"]',
    },
    enrichments:  ['glassdoor_crossref'],
    strategy:     'generic',
    listSelector: '.job_seen_beacon',
  },
  'wellfound.com': {
    selectors: {
      title:    '.job-title',
      company:  '.startup-link',
      funding:  '.company-funding',
      teamSize: '.company-size',
      remote:   '.remote-ok',
      techStack:'.tags-list',
      salary:   '.compensation',
    },
    enrichments:  ['crunchbase', 'linkedin_crossref'],
    strategy:     'startup',
    listSelector: '.job-listing',
  },
  'instahyre.com': {
    selectors: {
      title:         '.job-title-text',
      company:       '.company-name',
      posted:        '.job-posted-on',
      techStack:     '.skills-section',
      recruiterName: '.interviewer-info',
      salary:        '.salary-range',
    },
    enrichments:  ['linkedin_crossref'],
    strategy:     'instahyre',
    listSelector: '.job-card',
  },
}
