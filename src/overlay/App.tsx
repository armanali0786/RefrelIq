import { useEffect } from 'react'
import { PanelContainer } from './components/PanelContainer'
import { useJobStore } from '@/store/useJobStore'
import type { AppMessage } from '@/types/messages'

export function OverlayApp() {
  const { setScore, setEnrichment, setStrategy, setDraft, setDraftError, setLoadingScore, setLoadingRecruiter, setLoadingDraft } = useJobStore()

  useEffect(() => {
    const handler = (msg: AppMessage) => {
      if (msg.type === 'SCORE_PARTIAL') { setScore(msg.payload); setLoadingScore(false) }
      if (msg.type === 'SCORE_FINAL')   { setScore(msg.payload); setLoadingScore(false) }
      if (msg.type === 'ENRICHMENT_RESULT') { setEnrichment(msg.payload); setLoadingRecruiter(false) }
      if (msg.type === 'STRATEGY_RESULT')   { setStrategy(msg.payload) }
      if (msg.type === 'DRAFT_RESULT')  { setDraft(msg.payload); setLoadingDraft(false) }
      if (msg.type === 'ERROR')         { setDraftError(msg.payload.message); setLoadingDraft(false) }
    }
    chrome.runtime.onMessage.addListener(handler as Parameters<typeof chrome.runtime.onMessage.addListener>[0])
    return () => chrome.runtime.onMessage.removeListener(handler as Parameters<typeof chrome.runtime.onMessage.addListener>[0])
  }, [setScore, setEnrichment, setStrategy, setDraft, setDraftError, setLoadingScore, setLoadingRecruiter, setLoadingDraft])

  return <PanelContainer />
}
