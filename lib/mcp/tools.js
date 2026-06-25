// MCP (Model Context Protocol) tool definitions for AI EventOps Assistant.
//
// This is a PLACEHOLDER that makes the app "MCP-ready". Each tool below mirrors a
// core business action and is strongly typed with a zod input schema, a mock handler
// and a sample response. A real MCP server (e.g. @modelcontextprotocol/sdk) can later
// register these tools and route them to the same service layer used by the REST API.
//
// See docs/mcp-roadmap.md for the full roadmap.

import { z } from 'zod'

export const eventStatusEnum = z.enum(['Draft', 'Published', 'Completed'])
export const leadStageEnum = z.enum(['New', 'Contacted', 'Interested', 'Converted', 'Closed'])
export const contentTypeEnum = z.enum([
  'Facebook post',
  'Instagram caption',
  '45-second reel script',
  'Email announcement',
  'FAQ page',
  'LinkedIn post',
])

export const MCP_TOOLS = [
  {
    name: 'create_event',
    description: 'Create a new event with venue, date, organiser and policy details.',
    inputSchema: z.object({
      name: z.string().min(2),
      date: z.string(),
      venue: z.string(),
      city: z.string(),
      organiserName: z.string().optional(),
      organiserEmail: z.string().email().optional(),
      status: eventStatusEnum.default('Draft'),
    }),
    sampleResponse: { id: 'evt_123', name: 'New Event', status: 'Draft' },
  },
  {
    name: 'get_events',
    description: 'List all events, optionally filtered by status or a search query.',
    inputSchema: z.object({
      status: eventStatusEnum.optional(),
      query: z.string().optional(),
    }),
    sampleResponse: { count: 6, events: [{ id: 'evt_123', name: 'Bollywood Nights Auckland 2025' }] },
  },
  {
    name: 'get_event_by_id',
    description: 'Fetch a single event and its full context (FAQ, policies, logistics).',
    inputSchema: z.object({ eventId: z.string() }),
    sampleResponse: { id: 'evt_123', name: 'Bollywood Nights Auckland 2025', city: 'Auckland' },
  },
  {
    name: 'search_event_faq',
    description: 'Semantic search over an event FAQ and policy knowledge base.',
    inputSchema: z.object({ eventId: z.string(), query: z.string() }),
    sampleResponse: { answer: 'Paid parking is available at the Civic Car Park, 50m away.', source: 'parkingInfo' },
  },
  {
    name: 'generate_customer_reply',
    description: 'Generate a grounded, human-in-the-loop AI draft reply to a customer message.',
    inputSchema: z.object({ message: z.string(), eventId: z.string().optional() }),
    sampleResponse: { reply: 'Yes, paid parking is available 50m away.', confidence: 0.93, riskLevel: 'Low' },
  },
  {
    name: 'classify_customer_message',
    description: 'Classify a customer message into a lead/enquiry category with risk and confidence.',
    inputSchema: z.object({ message: z.string() }),
    sampleResponse: { category: 'Refund Request', riskLevel: 'High', confidence: 0.9 },
  },
  {
    name: 'create_lead',
    description: 'Create a CRM lead from an enquiry and place it in the pipeline.',
    inputSchema: z.object({
      name: z.string(),
      email: z.string().email().optional(),
      category: z.string(),
      eventId: z.string().optional(),
      stage: leadStageEnum.default('New'),
    }),
    sampleResponse: { id: 'lead_123', stage: 'New' },
  },
  {
    name: 'approve_ai_reply',
    description: 'Approve a pending AI draft reply (human-in-the-loop). Updates audit log.',
    inputSchema: z.object({ messageId: z.string(), editedReply: z.string().optional() }),
    sampleResponse: { id: 'msg_123', status: 'Approved' },
  },
  {
    name: 'generate_social_content',
    description: 'Generate marketing content (social post, reel script, email, FAQ) for an event.',
    inputSchema: z.object({ eventId: z.string(), type: contentTypeEnum, prompt: z.string().optional() }),
    sampleResponse: { type: 'Instagram caption', content: '✨ BOLLYWOOD NIGHTS ✨ ...' },
  },
  {
    name: 'get_pending_approvals',
    description: 'List AI draft replies awaiting human approval, with risk and confidence.',
    inputSchema: z.object({ riskLevel: z.enum(['Low', 'Medium', 'High']).optional() }),
    sampleResponse: { count: 4, approvals: [{ id: 'msg_123', riskLevel: 'High' }] },
  },
]

// Lightweight metadata version (safe to send over the wire / render in UI).
export function getToolManifest() {
  return MCP_TOOLS.map((t) => ({
    name: t.name,
    description: t.description,
    sampleResponse: t.sampleResponse,
  }))
}
