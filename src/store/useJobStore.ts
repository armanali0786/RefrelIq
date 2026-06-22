import { create } from 'zustand'
import type { NormalizedJob, ResumeData } from '@/types/job'
import type { OpportunityScore, OutreachStrategy } from '@/types/scoring'
import type { EnrichmentData } from '@/types/enrichment'

type Tab = 'score' | 'recruiter' | 'match'
type Tone = 'professional' | 'casual' | 'concise'

interface PanelState {
  collapsed:    boolean
  activeTab:    Tab
  draftOpen:    boolean
  tone:         Tone
  copied:       boolean
}

interface JobStore extends PanelState {
  currentJob:   NormalizedJob | null
  score:        OpportunityScore | null
  enrichment:   EnrichmentData | null
  strategy:     OutreachStrategy | null
  draftMessage: string | null
  resume:       ResumeData | null
  isLoadingScore:     boolean
  isLoadingRecruiter: boolean
  isLoadingDraft:     boolean
  draftError:   string | null
  setJob:           (job: NormalizedJob) => void
  setScore:         (score: OpportunityScore) => void
  setEnrichment:    (data: EnrichmentData) => void
  setStrategy:      (s: OutreachStrategy) => void
  setDraft:         (msg: string | null) => void
  setResume:        (r: ResumeData | null) => void
  setActiveTab:     (tab: Tab) => void
  setCollapsed:     (v: boolean) => void
  setDraftOpen:     (v: boolean) => void
  setTone:          (t: Tone) => void
  setCopied:        (v: boolean) => void
  setLoadingScore:  (v: boolean) => void
  setLoadingRecruiter: (v: boolean) => void
  setLoadingDraft:  (v: boolean) => void
  setDraftError:    (e: string | null) => void
  reset:            () => void
}

const initial: Omit<JobStore, keyof Pick<JobStore,
  'setJob'|'setScore'|'setEnrichment'|'setStrategy'|'setDraft'|'setResume'|
  'setActiveTab'|'setCollapsed'|'setDraftOpen'|'setTone'|'setCopied'|
  'setLoadingScore'|'setLoadingRecruiter'|'setLoadingDraft'|'setDraftError'|'reset'
>> = {
  currentJob: null, score: null, enrichment: null, strategy: null,
  draftMessage: null, resume: null,
  collapsed: false, activeTab: 'score', draftOpen: false,
  tone: 'casual', copied: false,
  isLoadingScore: false, isLoadingRecruiter: false, isLoadingDraft: false,
  draftError: null,
}

export const useJobStore = create<JobStore>((set) => ({
  ...initial,
  setJob:              (currentJob)   => set({ currentJob, score: null, enrichment: null, strategy: null }),
  setScore:            (score)        => set({ score, isLoadingScore: false }),
  setEnrichment:       (enrichment)   => set({ enrichment, isLoadingRecruiter: false }),
  setStrategy:         (strategy)     => set({ strategy }),
  setDraft:            (draftMessage) => set({ draftMessage, isLoadingDraft: false }),
  setResume:           (resume)       => set({ resume }),
  setActiveTab:        (activeTab)    => set({ activeTab }),
  setCollapsed:        (collapsed)    => set({ collapsed }),
  setDraftOpen:        (draftOpen)    => set({ draftOpen }),
  setTone:             (tone)         => set({ tone }),
  setCopied:           (copied)       => set({ copied }),
  setLoadingScore:     (v)            => set({ isLoadingScore: v }),
  setLoadingRecruiter: (v)            => set({ isLoadingRecruiter: v }),
  setLoadingDraft:     (v)            => set({ isLoadingDraft: v }),
  setDraftError:       (draftError)   => set({ draftError }),
  reset:               ()             => set(initial),
}))
