// Ravi AI Voice Copilot — configuration.
// The module is OPTIONAL and click-to-speak only. It never listens in the background.

export const voiceConfig = {
  /** Master switch so the feature can be disabled later without code removal. */
  enabled: true,
  /** BCP-47 language for speech recognition + synthesis. */
  lang: 'en-NZ',
  /** Speak responses aloud by default (user can toggle). */
  defaultSpeakReplies: true,
  /** Below this confidence we return a safe fallback. */
  confidenceFloor: 0.4,
  /** Routes where the floating button is shown. */
  enabledRoutes: [
    '/dashboard',
    '/dashboard/events',
    '/dashboard/inbox',
    '/dashboard/approvals',
    '/dashboard/ai-content',
    '/dashboard/leads',
    '/dashboard/settings',
    '/dashboard/governance',
  ],
} as const

export type VoiceConfig = typeof voiceConfig
