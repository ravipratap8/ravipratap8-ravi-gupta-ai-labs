// Ravi AI Voice Copilot — shared types (strict TypeScript).

export type IntentCategory =
  | 'navigation'
  | 'content_generation'
  | 'approval_action'
  | 'lead_action'
  | 'enquiry_action'
  | 'help'
  | 'fallback'

export type ActionType =
  | 'navigate'
  | 'generate_content'
  | 'approval'
  | 'lead'
  | 'enquiry'
  | 'help'
  | 'none'

export interface VoiceIntent {
  intent: string
  label: string
  category: IntentCategory
  actionType: ActionType
  /** Navigation target route, when applicable. */
  target?: string
  /** Extra payload, e.g. content type for generation. */
  payload?: Record<string, string>
  /** Spoken/printed response shown to the user. */
  response: string
  /** If true, the UI must ask the user to confirm before executing. */
  requiresConfirmation?: boolean
  /** Future MCP tool this maps to (placeholder, not yet executed). */
  mcpTool?: string | null
}

export interface CommandDefinition extends Omit<VoiceIntent, 'response'> {
  /** Trigger keywords/phrases (lowercase). Matched tolerantly. */
  patterns: string[]
  response: string
}

export interface VoiceCommandResult {
  success: boolean
  intent: string
  label?: string
  category: IntentCategory
  confidence: number
  actionType: ActionType
  target?: string
  payload?: Record<string, string>
  response: string
  requiresConfirmation?: boolean
  mcpTool?: string | null
}

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'done' | 'error'
