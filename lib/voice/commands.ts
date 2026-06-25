// Ravi AI Voice Copilot — command catalogue.
// Each command lists tolerant trigger patterns and the intent it resolves to.

import type { CommandDefinition } from './types'

export const COMMANDS: CommandDefinition[] = [
  // ---------------- Navigation ----------------
  { intent: 'open_dashboard', label: 'Open dashboard', category: 'navigation', actionType: 'navigate', target: '/dashboard',
    patterns: ['open dashboard', 'go to dashboard', 'show dashboard', 'home', 'overview'], response: 'Opening the dashboard.', mcpTool: null },
  { intent: 'open_events', label: 'Open events', category: 'navigation', actionType: 'navigate', target: '/dashboard/events',
    patterns: ['open events', 'go to events', 'show events', 'take me to events', 'events page'], response: 'Opening events.', mcpTool: 'get_events' },
  { intent: 'open_inbox', label: 'Open inbox', category: 'navigation', actionType: 'navigate', target: '/dashboard/inbox',
    patterns: ['open inbox', 'go to inbox', 'show inbox', 'open ai inbox', 'messages'], response: 'Opening the AI inbox.', mcpTool: null },
  { intent: 'open_approvals', label: 'Open approvals', category: 'navigation', actionType: 'navigate', target: '/dashboard/approvals',
    patterns: ['open approvals', 'go to approvals', 'show approvals', 'take me to approvals', 'approvals'], response: 'Opening approvals.', mcpTool: null },
  { intent: 'open_leads', label: 'Open leads', category: 'navigation', actionType: 'navigate', target: '/dashboard/leads',
    patterns: ['open leads', 'go to leads', 'show leads', 'crm', 'pipeline', 'take me to leads'], response: 'Opening leads.', mcpTool: null },
  { intent: 'open_ai_content', label: 'Open AI content', category: 'navigation', actionType: 'navigate', target: '/dashboard/ai-content',
    patterns: ['open ai content', 'go to content', 'show content', 'content generator', 'open content'], response: 'Opening the AI content generator.', mcpTool: null },
  { intent: 'open_settings', label: 'Open settings', category: 'navigation', actionType: 'navigate', target: '/dashboard/settings',
    patterns: ['open settings', 'go to settings', 'show settings', 'preferences'], response: 'Opening settings.', mcpTool: null },
  { intent: 'open_governance', label: 'Open AI governance', category: 'navigation', actionType: 'navigate', target: '/dashboard/governance',
    patterns: ['open governance', 'ai governance', 'ai safety', 'show governance', 'risk register'], response: 'Opening AI governance.', mcpTool: null },
  { intent: 'show_pending_approvals', label: 'Show pending approvals', category: 'navigation', actionType: 'navigate', target: '/dashboard/approvals',
    patterns: ['show pending approvals', 'pending approvals', 'what needs approval', 'whats pending'], response: 'Here are the pending approvals.', mcpTool: 'get_pending_approvals' },
  { intent: 'show_hot_leads', label: 'Show hot leads', category: 'navigation', actionType: 'navigate', target: '/dashboard/leads',
    patterns: ['show hot leads', 'hot leads', 'show me leads', 'best leads'], response: 'Showing your leads pipeline.', mcpTool: null },

  // ---------------- Content generation ----------------
  { intent: 'generate_facebook_post', label: 'Generate Facebook post', category: 'content_generation', actionType: 'generate_content', target: '/dashboard/ai-content', payload: { contentType: 'Facebook post' },
    patterns: ['generate facebook post', 'facebook post', 'make a facebook post', 'create facebook post'], response: 'Generating a Facebook post.', mcpTool: 'generate_social_content' },
  { intent: 'generate_instagram_caption', label: 'Generate Instagram caption', category: 'content_generation', actionType: 'generate_content', target: '/dashboard/ai-content', payload: { contentType: 'Instagram caption' },
    patterns: ['generate instagram caption', 'instagram caption', 'insta caption', 'make an instagram caption'], response: 'Generating an Instagram caption.', mcpTool: 'generate_social_content' },
  { intent: 'generate_reel_script', label: 'Generate reel script', category: 'content_generation', actionType: 'generate_content', target: '/dashboard/ai-content', payload: { contentType: '45-second reel script' },
    patterns: ['generate reel script', 'reel script', 'make a reel', 'video script'], response: 'Generating a reel script.', mcpTool: 'generate_social_content' },

  // ---------------- Event / enquiry ----------------
  { intent: 'create_new_event', label: 'Create new event', category: 'enquiry_action', actionType: 'navigate', target: '/dashboard/events/new',
    patterns: ['create new event', 'new event', 'add event', 'create event', 'make a new event'], response: 'Opening the new event form.', mcpTool: 'create_event' },
  { intent: 'simulate_enquiry', label: 'Simulate enquiry', category: 'enquiry_action', actionType: 'enquiry', target: '/dashboard/inbox', payload: { open: 'composer' },
    patterns: ['simulate enquiry', 'simulate inquiry', 'new enquiry', 'test enquiry', 'fake message'], response: 'Opening the inbox to simulate an enquiry.', mcpTool: 'classify_customer_message' },

  // ---------------- Approval actions (need confirmation) ----------------
  { intent: 'approve_selected_reply', label: 'Approve selected reply', category: 'approval_action', actionType: 'approval', target: '/dashboard/approvals', payload: { decision: 'approve' }, requiresConfirmation: true,
    patterns: ['approve selected reply', 'approve reply', 'approve this', 'approve the reply', 'approve top'], response: 'Approving an AI reply requires your confirmation.', mcpTool: 'approve_ai_reply' },
  { intent: 'reject_selected_reply', label: 'Reject selected reply', category: 'approval_action', actionType: 'approval', target: '/dashboard/approvals', payload: { decision: 'reject' }, requiresConfirmation: true,
    patterns: ['reject selected reply', 'reject reply', 'reject this', 'decline reply', 'reject top'], response: 'Rejecting an AI reply requires your confirmation.', mcpTool: null },

  // ---------------- Help ----------------
  { intent: 'help', label: 'Help', category: 'help', actionType: 'help',
    patterns: ['help', 'what can you do', 'commands', 'how do i use this', 'what can i say'], response: 'Here are the things I can do.', mcpTool: null },
]
