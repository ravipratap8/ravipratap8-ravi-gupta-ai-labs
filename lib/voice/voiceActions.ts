// Ravi AI Voice Copilot — cross-page action queue.
// Some voice intents navigate to a page and then trigger an action there
// (e.g. generate content, open the enquiry composer, approve the top card).
// We stash the pending action in sessionStorage; the target page consumes it on mount.

import type { VoiceCommandResult } from './types'

const KEY = 'ravi-voice-pending-action'

export interface PendingVoiceAction {
  actionType: VoiceCommandResult['actionType']
  intent: string
  payload?: Record<string, string>
}

export function queueVoiceAction(action: PendingVoiceAction): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(action))
  } catch {
    /* ignore */
  }
}

export function consumeVoiceAction(): PendingVoiceAction | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return null
    window.sessionStorage.removeItem(KEY)
    return JSON.parse(raw) as PendingVoiceAction
  } catch {
    return null
  }
}
