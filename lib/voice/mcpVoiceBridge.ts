// Ravi AI Voice Copilot — MCP bridge (PLACEHOLDER).
//
// Today the copilot executes everything via local navigation + in-app events.
// This bridge documents how each voice intent will map to an MCP tool later,
// so a future MCP server can execute these actions through an AI agent.
//
// === FUTURE WIRING ===
//   import { MCP_TOOLS } from '@/lib/mcp/tools'
//   const result = await mcpClient.callTool(tool, args)
// For now executeViaMcp() is intentionally NOT used at runtime.

import type { VoiceCommandResult } from './types'

export const intentToMcpTool: Record<string, string | null> = {
  open_dashboard: null,
  open_events: 'get_events',
  open_inbox: null,
  open_approvals: null,
  open_leads: null,
  open_ai_content: null,
  open_settings: null,
  open_governance: null,
  show_pending_approvals: 'get_pending_approvals',
  show_hot_leads: null,
  generate_facebook_post: 'generate_social_content',
  generate_instagram_caption: 'generate_social_content',
  generate_reel_script: 'generate_social_content',
  create_new_event: 'create_event',
  simulate_enquiry: 'classify_customer_message',
  approve_selected_reply: 'approve_ai_reply',
  reject_selected_reply: null,
  help: null,
  fallback: null,
}

export interface McpPlan {
  willUseMcp: boolean
  tool: string | null
  note: string
}

/** Describe (without executing) how an intent would run via MCP in the future. */
export function describeMcpPlan(result: VoiceCommandResult): McpPlan {
  const tool = result.mcpTool ?? intentToMcpTool[result.intent] ?? null
  if (!tool) {
    return { willUseMcp: false, tool: null, note: 'Handled locally (navigation / in-app action).' }
  }
  return {
    willUseMcp: true,
    tool,
    note: `Future: route to MCP tool "${tool}" with human-in-the-loop safety preserved.`,
  }
}

/** Placeholder — a real MCP call would go here. Never called in v1. */
export async function executeViaMcp(_result: VoiceCommandResult): Promise<never> {
  throw new Error('MCP execution not enabled in version 1 (placeholder).')
}
