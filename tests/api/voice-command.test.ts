import { describe, it, expect } from 'vitest'
import { routeCommand, getHelpCommands } from '../../lib/voice/intentRouter'

describe('voice intentRouter', () => {
  it('maps "open approvals" to the approvals route', () => {
    const r = routeCommand('open approvals')
    expect(r.success).toBe(true)
    expect(r.intent).toBe('open_approvals')
    expect(r.actionType).toBe('navigate')
    expect(r.target).toBe('/dashboard/approvals')
  })

  it('handles command variations', () => {
    for (const phrase of ['go to approvals', 'take me to approvals', 'show approvals']) {
      expect(routeCommand(phrase).target).toBe('/dashboard/approvals')
    }
  })

  it('routes content generation with payload', () => {
    const r = routeCommand('generate instagram caption')
    expect(r.intent).toBe('generate_instagram_caption')
    expect(r.actionType).toBe('generate_content')
    expect(r.payload?.contentType).toBe('Instagram caption')
  })

  it('requires confirmation for approval actions', () => {
    const r = routeCommand('approve selected reply')
    expect(r.intent).toBe('approve_selected_reply')
    expect(r.requiresConfirmation).toBe(true)
  })

  it('returns a safe fallback for unknown commands', () => {
    const r = routeCommand('make me a sandwich please')
    expect(r.success).toBe(false)
    expect(r.intent).toBe('fallback')
  })

  it('exposes a help command list', () => {
    expect(getHelpCommands().length).toBeGreaterThan(5)
  })
})
