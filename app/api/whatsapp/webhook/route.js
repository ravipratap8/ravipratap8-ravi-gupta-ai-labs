import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

let openai = null
let supabaseAdmin = null

function clean(value) {
  return String(value || '').trim()
}

function ok(data, status = 200) {
  return NextResponse.json(data, { status })
}

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return openai
}

function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing')
  }

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing')
  }

  supabaseAdmin = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabaseAdmin
}

function normalizeRisk(value) {
  const risk = String(value || '').toLowerCase()

  if (risk === 'high') return 'high'
  if (risk === 'medium') return 'medium'
  if (risk === 'low') return 'low'

  return 'medium'
}

function normalizeConfidence(value, fallback = 0.75) {
  const number = Number(value)

  if (!Number.isFinite(number)) return fallback
  if (number > 1 && number <= 100) return Math.max(0, Math.min(1, number / 100))

  return Math.max(0, Math.min(1, number))
}

function extractOutputText(response) {
  if (response?.output_text) return clean(response.output_text)

  const chunks = []

  for (const item of response?.output || []) {
    for (const part of item?.content || []) {
      if (part?.text) chunks.push(part.text)
    }
  }

  return clean(chunks.join('\n'))
}

function parseJson(text) {
  const value = clean(text)
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {}

  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i)

  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim())
    } catch {}
  }

  const object = value.match(/\{[\s\S]*\}/)

  if (object?.[0]) {
    try {
      return JSON.parse(object[0])
    } catch {}
  }

  return null
}

async function runAI({ instructions, input, maxOutputTokens = 700 }) {
  const client = getOpenAI()

  if (!client) {
    throw new Error('OPENAI_API_KEY is missing')
  }

  const response = await client.responses.create({
    model: AI_MODEL,
    input: [
      {
        role: 'developer',
        content: [{ type: 'input_text', text: instructions }],
      },
      {
        role: 'user',
        content: [{ type: 'input_text', text: input }],
      },
    ],
    max_output_tokens: maxOutputTokens,
  })

  return extractOutputText(response)
}

function fallbackClassification(message = '') {
  const text = message.toLowerCase()

  if (text.includes('refund') || text.includes('cancel')) {
    return {
      category: 'Refund',
      risk_level: 'high',
      confidence: 0.9,
      reasoning: 'Refund and cancellation enquiries require organiser review.',
      aiProvider: 'fallback',
      model: 'rule-based',
    }
  }

  if (text.includes('complaint') || text.includes('angry') || text.includes('unhappy')) {
    return {
      category: 'Complaint',
      risk_level: 'high',
      confidence: 0.88,
      reasoning: 'Complaint messages require careful human review.',
      aiProvider: 'fallback',
      model: 'rule-based',
    }
  }

  if (text.includes('meet') || text.includes('vip')) {
    return {
      category: 'VIP / Meet & Greet',
      risk_level: 'medium',
      confidence: 0.84,
      reasoning: 'VIP and meet-and-greet details need confirmation before sending.',
      aiProvider: 'fallback',
      model: 'rule-based',
    }
  }

  if (text.includes('ticket') || text.includes('seat')) {
    return {
      category: 'Ticketing',
      risk_level: 'medium',
      confidence: 0.82,
      reasoning: 'Ticketing enquiries may affect booking accuracy.',
      aiProvider: 'fallback',
      model: 'rule-based',
    }
  }

  if (text.includes('sponsor') || text.includes('partnership')) {
    return {
      category: 'Lead',
      risk_level: 'medium',
      confidence: 0.8,
      reasoning: 'Commercial enquiries should be reviewed before reply.',
      aiProvider: 'fallback',
      model: 'rule-based',
    }
  }

  return {
    category: 'General',
    risk_level: 'low',
    confidence: 0.76,
    reasoning: 'General customer enquiry with low operational risk.',
    aiProvider: 'fallback',
    model: 'rule-based',
  }
}

async function classifyMessageAI(message = '') {
  const fallback = fallbackClassification(message)

  if (!getOpenAI()) return fallback

  try {
    const output = await runAI({
      instructions: `You classify customer enquiries for an event operations platform.
Return JSON only with these keys:
{
  "category": "Refund | Ticketing | VIP / Meet & Greet | Lead | General | Safety | Complaint",
  "risk_level": "low | medium | high",
  "confidence": 0.0,
  "reasoning": "one short reason"
}
Rules:
- Refund, cancellation, complaint, safety, payment, legal, or policy-sensitive messages are high risk.
- Ticketing, seating, VIP, and organiser-specific messages are medium risk.
- Generic informational messages are low risk.`,
      input: `Customer message: ${message}`,
      maxOutputTokens: 300,
    })

    const parsed = parseJson(output)

    if (!parsed) return fallback

    return {
      category: clean(parsed.category) || fallback.category,
      risk_level: normalizeRisk(parsed.risk_level || parsed.riskLevel || fallback.risk_level),
      confidence: normalizeConfidence(parsed.confidence, fallback.confidence),
      reasoning: clean(parsed.reasoning) || fallback.reasoning,
      aiProvider: 'openai',
      model: AI_MODEL,
    }
  } catch (error) {
    console.warn('WhatsApp AI classification fallback:', error?.message || error)
    return fallback
  }
}

function eventKnowledge(event) {
  if (!event) {
    return 'No event selected. Use only generic safe language.'
  }

  return JSON.stringify(
    {
      name: event.name || event.title,
      title: event.title || event.name,
      venue: event.venue,
      city: event.city,
      date: event.event_date || event.starts_at,
      status: event.status,
      knowledgeBase: event.knowledge_base || {},
    },
    null,
    2
  )
}

function fallbackReply(message, event) {
  const eventName = event?.name || event?.title || 'the event'

  return `Thanks for your WhatsApp message about ${eventName}. I have prepared this draft based on the available event information. Please review and confirm the final details before sending this to the customer.`
}

async function buildReplyAI({ message, event, classification }) {
  const fallback = fallbackReply(message, event)

  if (!getOpenAI()) return fallback

  try {
    const output = await runAI({
      instructions: `You draft WhatsApp customer replies for an event operations team.
Rules:
- Use only the supplied event knowledge.
- Do not invent prices, ticket links, refund decisions, seating availability, performer details, or policies.
- If risk is high, clearly say the request needs organiser review.
- Keep the reply short, professional, and suitable for WhatsApp.
- Do not claim the message has already been sent.
- Return plain text only.`,
      input: `Event knowledge:
${eventKnowledge(event)}

Classification:
${JSON.stringify(classification, null, 2)}

Customer WhatsApp message:
${message}`,
      maxOutputTokens: 450,
    })

    return clean(output) || fallback
  } catch (error) {
    console.warn('WhatsApp AI reply fallback:', error?.message || error)
    return fallback
  }
}

async function getFirstEvent(supabase, workspaceId) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  return data || null
}

function extractWhatsAppMessages(payload) {
  const results = []

  for (const entry of payload?.entry || []) {
    for (const change of entry?.changes || []) {
      const value = change?.value

      if (!value?.messages?.length) continue

      for (const message of value.messages) {
        const contact = value.contacts?.find((item) => item.wa_id === message.from)
        const customerName = contact?.profile?.name || 'WhatsApp Customer'

        const text =
          message?.text?.body ||
          message?.button?.text ||
          message?.interactive?.button_reply?.title ||
          message?.interactive?.list_reply?.title ||
          ''

        results.push({
          whatsappMessageId: message.id,
          from: message.from,
          timestamp: message.timestamp,
          type: message.type,
          customerName,
          text: clean(text),
          phoneNumberId: value.metadata?.phone_number_id,
          displayPhoneNumber: value.metadata?.display_phone_number,
          raw: message,
        })
      }
    }
  }

  return results
}

async function messageAlreadyProcessed(supabase, workspaceId, whatsappMessageId) {
  if (!whatsappMessageId) return false

  const { data, error } = await supabase
    .from('messages')
    .select('id')
    .eq('workspace_id', workspaceId)
    .contains('metadata', { whatsapp_message_id: whatsappMessageId })
    .limit(1)

  if (error) {
    console.warn('Duplicate WhatsApp check failed:', error?.message || error)
    return false
  }

  return Boolean(data?.length)
}

async function writeWebhookAudit(supabase, workspaceId, action, entityType, entityId, metadata = {}) {
  try {
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      actor_id: null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
    })
  } catch (error) {
    console.warn('WhatsApp audit log failed:', error?.message || error)
  }
}

async function processWhatsAppMessage({ supabase, workspaceId, item }) {
  if (!item.text) {
    await writeWebhookAudit(supabase, workspaceId, 'whatsapp.message.ignored', 'message', null, {
      reason: 'No text body found',
      whatsapp_message_id: item.whatsappMessageId,
      message_type: item.type,
    })

    return { skipped: true, reason: 'No text body found' }
  }

  const duplicate = await messageAlreadyProcessed(
    supabase,
    workspaceId,
    item.whatsappMessageId
  )

  if (duplicate) {
    return { skipped: true, reason: 'Duplicate WhatsApp message' }
  }

  const event = await getFirstEvent(supabase, workspaceId)
  const classification = await classifyMessageAI(item.text)
  const reply = await buildReplyAI({
    message: item.text,
    event,
    classification,
  })

  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      workspace_id: workspaceId,
      event_id: event?.id || null,
      customer_name: item.customerName || 'WhatsApp Customer',
      customer_channel: 'whatsapp',
      customer_message: item.text,
      category: classification.category,
      risk_level: classification.risk_level,
      confidence: classification.confidence,
      ai_draft: reply,
      status: 'drafted',
      metadata: {
        source: 'whatsapp_cloud_api',
        whatsapp_message_id: item.whatsappMessageId,
        whatsapp_from: item.from,
        whatsapp_phone_number_id: item.phoneNumberId,
        whatsapp_display_phone_number: item.displayPhoneNumber,
        whatsapp_message_type: item.type,
        received_at: new Date().toISOString(),
        aiProvider: classification.aiProvider,
        model: classification.model,
        reasoning: classification.reasoning,
      },
    })
    .select('*')
    .single()

  if (messageError) throw messageError

  const { data: approval, error: approvalError } = await supabase
    .from('ai_approvals')
    .insert({
      workspace_id: workspaceId,
      message_id: message.id,
      ai_output: reply,
      risk_level: classification.risk_level,
      confidence: classification.confidence,
      status: 'pending',
    })
    .select('*')
    .single()

  if (approvalError) throw approvalError

  await writeWebhookAudit(supabase, workspaceId, 'whatsapp.message.received', 'message', message.id, {
    whatsapp_message_id: item.whatsappMessageId,
    whatsapp_from: item.from,
    customer_name: item.customerName,
  })

  await writeWebhookAudit(supabase, workspaceId, 'ai.reply.drafted.from_whatsapp', 'message', message.id, {
    source: classification.aiProvider,
    model: classification.model,
    category: classification.category,
    risk_level: classification.risk_level,
    confidence: classification.confidence,
    approval_id: approval.id,
  })

  return {
    messageId: message.id,
    approvalId: approval.id,
    category: classification.category,
    riskLevel: classification.risk_level,
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  return new Response('Forbidden', { status: 403 })
}

export async function POST(request) {
  try {
    const workspaceId = process.env.WHATSAPP_WORKSPACE_ID

    if (!workspaceId) {
      throw new Error('WHATSAPP_WORKSPACE_ID is missing')
    }

    const payload = await request.json().catch(() => ({}))
    const messages = extractWhatsAppMessages(payload)

    if (!messages.length) {
      return ok({
        received: true,
        processed: 0,
        note: 'No WhatsApp message objects found',
      })
    }

    const supabase = getSupabaseAdmin()

    const results = []

    for (const item of messages) {
      const result = await processWhatsAppMessage({
        supabase,
        workspaceId,
        item,
      })

      results.push(result)
    }

    return ok({
      received: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)

    // Return 200 so Meta does not keep retrying forever.
    return ok({
      received: true,
      processed: 0,
      error: error?.message || String(error),
    })
  }
}