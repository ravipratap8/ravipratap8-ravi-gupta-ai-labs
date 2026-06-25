// Ravi AI Voice Copilot — intent router.
// Pure, deterministic, dependency-free so it can run on the client OR server
// (used by both the UI and the /api/voice/command route).

import { COMMANDS } from './commands'
import { voiceConfig } from './voiceConfig'
import type { CommandDefinition, VoiceCommandResult } from './types'

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scorePattern(transcript: string, pattern: string): number {
  const t = transcript
  const p = normalize(pattern)
  if (!p) return 0
  if (t === p) return 0.98
  if (t.includes(p)) {
    // Longer matched phrase relative to the whole transcript -> higher confidence.
    return Math.min(0.95, 0.72 + (p.length / (t.length + 1)) * 0.23)
  }
  const patternTokens = p.split(' ')
  const transcriptTokens = new Set(t.split(' '))
  const overlap = patternTokens.filter((w) => transcriptTokens.has(w)).length / patternTokens.length
  return overlap >= 0.6 ? 0.5 + overlap * 0.4 : overlap * 0.5
}

function fallback(confidence: number): VoiceCommandResult {
  return {
    success: false,
    intent: 'fallback',
    category: 'fallback',
    confidence: Number(confidence.toFixed(2)),
    actionType: 'none',
    response:
      'I could not confidently understand that command. Try saying: open approvals, show hot leads, or generate Facebook post.',
  }
}

export function routeCommand(transcript: string): VoiceCommandResult {
  const t = normalize(transcript || '')
  if (!t) return fallback(0)

  let best: CommandDefinition | null = null
  let bestScore = 0
  for (const cmd of COMMANDS) {
    for (const pattern of cmd.patterns) {
      const score = scorePattern(t, pattern)
      if (score > bestScore) {
        bestScore = score
        best = cmd
      }
    }
  }

  if (!best || bestScore < voiceConfig.confidenceFloor) return fallback(bestScore)

  return {
    success: true,
    intent: best.intent,
    label: best.label,
    category: best.category,
    confidence: Number(bestScore.toFixed(2)),
    actionType: best.actionType,
    target: best.target,
    payload: best.payload,
    response: best.response,
    requiresConfirmation: best.requiresConfirmation,
    mcpTool: best.mcpTool ?? null,
  }
}

export interface HelpEntry {
  label: string
  example: string
  category: string
}

export function getHelpCommands(): HelpEntry[] {
  return COMMANDS.map((c) => ({ label: c.label, example: c.patterns[0], category: c.category }))
}
