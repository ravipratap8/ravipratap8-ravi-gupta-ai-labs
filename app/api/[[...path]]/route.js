import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
let openai = null;

function ok(data, status = 200) {
  return NextResponse.json(data, { status });
}

function fail(error, status = 500) {
  console.error('API Error:', error);
  return NextResponse.json(
    { error: error?.message || String(error) || 'Server error' },
    { status }
  );
}

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

function clean(value) {
  return String(value || '').trim();
}

function slugify(value = 'event') {
  const base = clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `${base || 'event'}-${Date.now()}`;
}

function uuid() {
  return crypto.randomUUID();
}

function stripUndefined(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

function normalizeRisk(value) {
  const risk = String(value || '').toLowerCase();
  if (risk === 'high') return 'high';
  if (risk === 'medium') return 'medium';
  if (risk === 'low') return 'low';
  return 'medium';
}

function normalizeConfidence(value, fallback = 0.75) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  if (number > 1 && number <= 100) return Math.max(0, Math.min(1, number / 100));
  return Math.max(0, Math.min(1, number));
}

function extractOutputText(response) {
  if (response?.output_text) return clean(response.output_text);

  const chunks = [];
  for (const item of response?.output || []) {
    for (const part of item?.content || []) {
      if (part?.text) chunks.push(part.text);
    }
  }

  return clean(chunks.join('\n'));
}

function parseJson(text) {
  const value = clean(text);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {}

  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {}
  }

  const object = value.match(/\{[\s\S]*\}/);
  if (object?.[0]) {
    try {
      return JSON.parse(object[0]);
    } catch {}
  }

  return null;
}

async function runAI({ instructions, input, maxOutputTokens = 700 }) {
  const client = getOpenAI();
  if (!client) throw new Error('OPENAI_API_KEY is missing');

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
  });

  return extractOutputText(response);
}

async function getPath(context) {
  const params = await context.params;
  return params?.path || [];
}

async function getContext() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { supabase, user: null, profile: null, workspace: null };
  }

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from('profiles')
    .select('id, workspace_id, full_name, email, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileLookupError) throw profileLookupError;

  if (existingProfile?.workspace_id) {
    const { data: workspace, error: workspaceLookupError } = await supabase
      .from('workspaces')
      .select('id, name, slug')
      .eq('id', existingProfile.workspace_id)
      .maybeSingle();

    if (workspaceLookupError) throw workspaceLookupError;

    if (workspace) {
      return { supabase, user, profile: existingProfile, workspace };
    }
  }

  const { data: ownedWorkspace, error: ownedWorkspaceError } = await supabase
    .from('workspaces')
    .select('id, name, slug')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (ownedWorkspaceError) throw ownedWorkspaceError;

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User';

  if (ownedWorkspace) {
    const { data: profile, error: profileUpsertError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          workspace_id: ownedWorkspace.id,
          full_name: existingProfile?.full_name || fullName,
          email: existingProfile?.email || user.email,
          role: existingProfile?.role || 'owner',
        },
        { onConflict: 'id' }
      )
      .select('id, workspace_id, full_name, email, role')
      .single();

    if (profileUpsertError) throw profileUpsertError;

    return { supabase, user, profile, workspace: ownedWorkspace };
  }

  const emailPrefix = user.email?.split('@')[0] || 'workspace';
  const safePrefix = emailPrefix
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      owner_id: user.id,
      name: `${fullName}'s Workspace`,
      slug: `${safePrefix || 'workspace'}-${user.id.slice(0, 8)}-${Date.now()}`,
    })
    .select('id, name, slug')
    .single();

  if (workspaceError) throw workspaceError;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        workspace_id: workspace.id,
        full_name: fullName,
        email: user.email,
        role: 'owner',
      },
      { onConflict: 'id' }
    )
    .select('id, workspace_id, full_name, email, role')
    .single();

  if (profileError) throw profileError;

  await supabase.from('audit_logs').insert({
    workspace_id: workspace.id,
    actor_id: user.id,
    action: 'workspace.created',
    entity_type: 'workspace',
    entity_id: workspace.id,
    metadata: { source: 'api_context' },
  });

  return { supabase, user, profile, workspace };
}

function requireWorkspace(ctx) {
  if (!ctx.user) throw new Error('Not authenticated');
  if (!ctx.workspace?.id) throw new Error('Workspace not found');
}

async function writeAudit(ctx, action, entityType, entityId = null, metadata = {}) {
  try {
    await ctx.supabase.from('audit_logs').insert({
      workspace_id: ctx.workspace.id,
      actor_id: ctx.user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
    });
  } catch (error) {
    console.warn('Audit log failed:', error?.message || error);
  }
}

function mapEvent(row) {
  return {
    ...row,
    title: row.title || row.name,
    name: row.name || row.title,
    date: row.event_date || row.starts_at,
    eventDate: row.event_date || row.starts_at,
    startsAt: row.starts_at,
    knowledgeBase: row.knowledge_base || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMessage(row) {
  return {
    ...row,
    customerName: row.customer_name,
    customerMessage: row.customer_message,
    customerChannel: row.customer_channel,
    riskLevel: row.risk_level,
    aiDraft: row.ai_draft,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapApproval(row) {
  return {
    ...row,
    riskLevel: row.risk_level,
    aiOutput: row.ai_output,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
  };
}

function mapLead(row) {
  return {
    ...row,
    title: row.title || row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapContent(row) {
  return {
    ...row,
    contentType: row.content_type,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fallbackClassification(message = '') {
  const text = message.toLowerCase();

  if (text.includes('refund') || text.includes('cancel')) {
    return {
      category: 'Refund',
      risk_level: 'high',
      confidence: 0.9,
      reasoning: 'Refund and cancellation enquiries require organiser review.',
      aiProvider: 'fallback',
      model: 'rule-based',
    };
  }

  if (text.includes('meet') || text.includes('vip')) {
    return {
      category: 'VIP / Meet & Greet',
      risk_level: 'medium',
      confidence: 0.84,
      reasoning: 'VIP and meet-and-greet details need confirmation before sending.',
      aiProvider: 'fallback',
      model: 'rule-based',
    };
  }

  if (text.includes('ticket') || text.includes('seat')) {
    return {
      category: 'Ticketing',
      risk_level: 'medium',
      confidence: 0.82,
      reasoning: 'Ticketing enquiries may affect booking accuracy.',
      aiProvider: 'fallback',
      model: 'rule-based',
    };
  }

  if (text.includes('sponsor') || text.includes('partnership')) {
    return {
      category: 'Lead',
      risk_level: 'medium',
      confidence: 0.8,
      reasoning: 'Commercial enquiries should be reviewed before reply.',
      aiProvider: 'fallback',
      model: 'rule-based',
    };
  }

  return {
    category: 'General',
    risk_level: 'low',
    confidence: 0.76,
    reasoning: 'General customer enquiry with low operational risk.',
    aiProvider: 'fallback',
    model: 'rule-based',
  };
}

async function classifyMessageAI(message = '') {
  const fallback = fallbackClassification(message);

  if (!getOpenAI()) return fallback;

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
    });

    const parsed = parseJson(output);
    if (!parsed) return fallback;

    return {
      category: clean(parsed.category) || fallback.category,
      risk_level: normalizeRisk(parsed.risk_level || parsed.riskLevel || fallback.risk_level),
      confidence: normalizeConfidence(parsed.confidence, fallback.confidence),
      reasoning: clean(parsed.reasoning) || fallback.reasoning,
      aiProvider: 'openai',
      model: AI_MODEL,
    };
  } catch (error) {
    console.warn('OpenAI classification fallback:', error?.message || error);
    return fallback;
  }
}

function eventKnowledge(event) {
  if (!event) return 'No event selected. Use only generic safe language.';

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
  );
}

function fallbackReply(message, event) {
  const eventName = event?.name || event?.title || 'the event';
  return `Thanks for your message about ${eventName}. I have reviewed your enquiry and prepared this draft based on the available event information. Please confirm the final details before sending this to the customer.`;
}

async function buildReplyAI({ message, event, classification }) {
  const fallback = fallbackReply(message, event);

  if (!getOpenAI()) return fallback;

  try {
    const output = await runAI({
      instructions: `You draft customer replies for an event operations team.
Rules:
- Use only the supplied event knowledge.
- Do not invent prices, ticket links, refund decisions, seating availability, performer details, or policies.
- If risk is high, clearly say the request needs organiser review.
- Keep the reply professional, concise, and ready for human approval.
- Do not claim the message has already been sent.
- Return plain text only.`,
      input: `Event knowledge:
${eventKnowledge(event)}

Classification:
${JSON.stringify(classification, null, 2)}

Customer message:
${message}`,
      maxOutputTokens: 450,
    });

    return clean(output) || fallback;
  } catch (error) {
    console.warn('OpenAI reply fallback:', error?.message || error);
    return fallback;
  }
}

function fallbackContent({ contentType, type, prompt, event }) {
  const finalType = contentType || type || 'social_post';
  const eventName = event?.name || event?.title || 'your event';
  const tone = prompt ? `\n\nTone note: ${prompt}` : '';
  const title = `${eventName} - ${finalType.replace(/_/g, ' ')}`;
  const body = `Get ready for ${eventName}.\n\nThis is an AI-assisted draft for ${finalType.replace(
    /_/g,
    ' '
  )}. Please review event details, confirm ticket information, and add the final call to action before publishing.${tone}`;

  return { title, body, content: body, contentType: finalType };
}

async function buildContentAI({ contentType, type, prompt, event }) {
  const finalType = contentType || type || 'social_post';
  const fallback = fallbackContent({ contentType, type, prompt, event });

  if (!getOpenAI()) return fallback;

  try {
    const output = await runAI({
      instructions: `You generate event marketing content for an enterprise AI demo.
Return JSON only:
{
  "title": "short content title",
  "body": "ready-to-review content body",
  "contentType": "same requested content type"
}
Rules:
- Use only supplied event details.
- Do not invent prices, dates, performers, ticket links, or claims.
- Keep it professional and suitable for human review.`,
      input: `Requested content type: ${finalType}
Additional prompt: ${prompt || 'No additional prompt'}
Event knowledge:
${eventKnowledge(event)}`,
      maxOutputTokens: 650,
    });

    const parsed = parseJson(output);
    if (!parsed) return { ...fallback, body: output || fallback.body, content: output || fallback.body };

    const body = clean(parsed.body) || fallback.body;
    return {
      title: clean(parsed.title) || fallback.title,
      body,
      content: body,
      contentType: clean(parsed.contentType) || finalType,
    };
  } catch (error) {
    console.warn('OpenAI content fallback:', error?.message || error);
    return fallback;
  }
}

async function getFirstEvent(ctx, workspaceId) {
  const { data, error } = await ctx.supabase
    .from('events')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function getEventByIdOrDefault(ctx, workspaceId, eventId) {
  if (eventId) {
    const { data, error } = await ctx.supabase
      .from('events')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('id', eventId)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;
  }

  return getFirstEvent(ctx, workspaceId);
}

async function getDashboardStats(ctx) {
  requireWorkspace(ctx);
  const workspaceId = ctx.workspace.id;

  const [
    eventsResult,
    publishedEventsResult,
    approvalsResult,
    messagesResult,
    leadsResult,
    contentResult,
    highRiskResult,
    auditResult,
  ] = await Promise.all([
    ctx.supabase.from('events').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    ctx.supabase.from('events').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'published'),
    ctx.supabase.from('ai_approvals').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'pending'),
    ctx.supabase.from('messages').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('status', 'drafted'),
    ctx.supabase.from('leads').select('id, stage').eq('workspace_id', workspaceId),
    ctx.supabase.from('generated_content').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    ctx.supabase.from('ai_approvals').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).eq('risk_level', 'high').eq('status', 'pending'),
    ctx.supabase.from('audit_logs').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false }).limit(5),
  ]);

  const leadRows = leadsResult.data || [];
  const priorityLeads = leadRows.filter((lead) => {
    const stage = String(lead.stage || '').toLowerCase();
    return ['interested', 'qualified', 'hot', 'converted'].includes(stage);
  }).length;

  return {
    totalEvents: eventsResult.count || 0,
    sampleEvents: eventsResult.count || 0,
    publishedEvents: publishedEventsResult.count || 0,
    pendingApprovals: approvalsResult.count || 0,
    pendingReviews: approvalsResult.count || 0,
    newEnquiries: messagesResult.count || 0,
    priorityLeads,
    totalLeads: leadRows.length,
    contentDrafts: contentResult.count || 0,
    highRiskQueued: highRiskResult.count || 0,
    aiGovernanceStatus: 'OK',
    recentActivity: auditResult.data || [],
  };
}

export async function GET(request, context) {
  try {
    const path = await getPath(context);
    const ctx = await getContext();

    if (path.join('/') === 'dashboard/stats') {
      return ok(await getDashboardStats(ctx));
    }

    requireWorkspace(ctx);
    const workspaceId = ctx.workspace.id;

    if (path[0] === 'events' && path.length === 1) {
      const { data, error } = await ctx.supabase
        .from('events')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return ok((data || []).map(mapEvent));
    }

    if (path[0] === 'events' && path[1]) {
      const { data, error } = await ctx.supabase
        .from('events')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('id', path[1])
        .single();

      if (error) throw error;
      return ok(mapEvent(data));
    }

    if (path[0] === 'messages') {
      const { data, error } = await ctx.supabase
        .from('messages')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return ok((data || []).map(mapMessage));
    }

if (path[0] === 'approvals') {
  const { data, error } = await ctx.supabase
    .from('ai_approvals')
    .select(`
      *,
      messages (
        id,
        customer_name,
        customer_channel,
        customer_message,
        category,
        risk_level,
        confidence,
        ai_draft,
        status,
        event_id,
        events (
          id,
          title,
          name,
          venue,
          city,
          event_date,
          starts_at
        )
      )
    `)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return ok(
    (data || []).map((row) => {
      const linkedMessage = row.messages ? mapMessage(row.messages) : null;
      const linkedEvent = row.messages?.events ? mapEvent(row.messages.events) : null;

      const customerMessage =
        row.messages?.customer_message ||
        linkedMessage?.customerMessage ||
        'No incoming message captured';

      const aiDraft =
        row.ai_output ||
        row.messages?.ai_draft ||
        linkedMessage?.aiDraft ||
        'No AI draft captured';

      return {
        ...mapApproval(row),

        // Keep message as text so React does not crash.
        message: customerMessage,

        // Keep linked object separately if UI needs it later.
        linkedMessage,
        event: linkedEvent,

        eventName: linkedEvent?.title || linkedEvent?.name || 'No sample event linked',
        customerName: row.messages?.customer_name || 'Customer',
        customerMessage,
        customerChannel: row.messages?.customer_channel || 'demo',
        category: row.messages?.category || 'General',
        riskLevel: row.risk_level || row.messages?.risk_level || 'medium',
        confidence: row.confidence || row.messages?.confidence || 0,
        aiDraft,
        aiOutput: aiDraft,
      };
    })
  );
}

    if (path[0] === 'leads') {
      const { data, error } = await ctx.supabase
        .from('leads')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return ok((data || []).map(mapLead));
    }

    if (path[0] === 'content') {
      const { data, error } = await ctx.supabase
        .from('generated_content')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return ok((data || []).map(mapContent));
    }

    if (path[0] === 'audit-logs') {
      const { data, error } = await ctx.supabase
        .from('audit_logs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return ok(data || []);
    }

    if (path[0] === 'mcp') {
      return ok({
        tools: [
          'create_event',
          'update_event',
          'search_event',
          'generate_customer_reply',
          'approve_ai_reply',
          'generate_social_content',
          'create_lead',
          'classify_message',
          'get_dashboard_metrics',
        ],
      });
    }

    return fail('Route not found', 404);
  } catch (error) {
    return fail(error, error?.message === 'Not authenticated' ? 401 : 500);
  }
}

export async function POST(request, context) {
  try {
    const path = await getPath(context);
    const body = await request.json().catch(() => ({}));
    const ctx = await getContext();

    requireWorkspace(ctx);
    const workspaceId = ctx.workspace.id;

    if (path[0] === 'events' && path.length === 1) {
      const title = clean(body.title || body.name) || 'Untitled event';
      const eventDate = body.event_date || body.eventDate || body.date || new Date().toISOString();

      const { data, error } = await ctx.supabase
        .from('events')
        .insert(
          stripUndefined({
            workspace_id: workspaceId,
            created_by: ctx.user.id,
            title,
            slug: body.slug || slugify(title),
            name: title,
            description: body.description || '',
            venue: body.venue || '',
            city: body.city || '',
            country: body.country || 'New Zealand',
            timezone: body.timezone || 'Pacific/Auckland',
            starts_at: eventDate,
            event_date: eventDate,
            status: body.status || 'draft',
            knowledge_base: body.knowledge_base || body.knowledgeBase || {},
          })
        )
        .select('*')
        .single();

      if (error) throw error;
      await writeAudit(ctx, 'event.created', 'event', data.id, { source: 'dashboard', title });
      return ok(mapEvent(data), 201);
    }

    if (path[0] === 'leads' && path.length === 1) {
      const title = clean(body.title || body.name) || 'New lead';

      const { data, error } = await ctx.supabase
        .from('leads')
        .insert(
          stripUndefined({
            workspace_id: workspaceId,
            event_id: body.event_id || body.eventId || null,
            title,
            name: body.name || title,
            email: body.email || null,
            phone: body.phone || null,
            source: body.source || 'manual',
            stage: body.stage || undefined,
            notes: body.notes || '',
            confidence: body.confidence || null,
          })
        )
        .select('*')
        .single();

      if (error) throw error;
      await writeAudit(ctx, 'lead.created', 'lead', data.id, { source: 'dashboard', title });
      return ok(mapLead(data), 201);
    }

    if (path[0] === 'content' && path.length === 1) {
      const contentType = body.content_type || body.contentType || body.type || 'social_post';

      const { data, error } = await ctx.supabase
        .from('generated_content')
        .insert(
          stripUndefined({
            workspace_id: workspaceId,
            event_id: body.event_id || body.eventId || null,
            content_type: contentType,
            title: body.title || 'Generated content',
            body: body.body || body.content || '',
            status: body.status || 'draft',
            created_by: ctx.user.id,
          })
        )
        .select('*')
        .single();

      if (error) throw error;
      await writeAudit(ctx, 'content.saved', 'generated_content', data.id, { source: 'dashboard', contentType });
      return ok(mapContent(data), 201);
    }

    if (path.join('/') === 'ai/classify-message') {
      const result = await classifyMessageAI(body.message || '');

      await writeAudit(ctx, 'ai.message.classified', 'message', null, {
        source: result.aiProvider,
        category: result.category,
        risk_level: result.risk_level,
        confidence: result.confidence,
        model: result.model,
      });

      return ok({ ...result, riskLevel: result.risk_level });
    }

    if (path.join('/') === 'ai/chat') {
      const event = await getEventByIdOrDefault(ctx, workspaceId, body.eventId || body.event_id);
      const classification = await classifyMessageAI(body.message || '');
      const reply = await buildReplyAI({ message: body.message || '', event, classification });

      const { data: message, error: messageError } = await ctx.supabase
        .from('messages')
        .insert(
          stripUndefined({
            workspace_id: workspaceId,
            
            event_id: event?.id || body.eventId || body.event_id || null,
            customer_name: body.customerName || body.customer_name || 'Customer',
            customer_channel: body.customerChannel || body.customer_channel || 'demo',
            customer_message: body.message || '',
            category: classification.category,
            risk_level: classification.risk_level,
            confidence: classification.confidence,
            ai_draft: reply,
            status: 'drafted',
            metadata: {
              aiProvider: classification.aiProvider,
              model: classification.model,
              reasoning: classification.reasoning,
            },
          })
        )
        .select('*')
        .single();

      if (messageError) throw messageError;

      const { data: approval, error: approvalError } = await ctx.supabase
        .from('ai_approvals')
        .insert(
          stripUndefined({
            workspace_id: workspaceId,
            message_id: message.id,
            ai_output: reply,
            risk_level: classification.risk_level,
            confidence: classification.confidence,
            status: 'pending',
          })
        )
        .select('*')
        .single();

      if (approvalError) throw approvalError;

      await writeAudit(ctx, 'ai.reply.drafted', 'message', message.id, {
        source: classification.aiProvider,
        model: classification.model,
        category: classification.category,
        risk_level: classification.risk_level,
        confidence: classification.confidence,
        approval_id: approval.id,
      });

      return ok({
        reply,
        draft: reply,
        classification,
        message: mapMessage(message),
        approval: mapApproval(approval),
      });
    }

    if (path.join('/') === 'ai/generate-content') {
      const event = await getEventByIdOrDefault(ctx, workspaceId, body.eventId || body.event_id);
      const generated = await buildContentAI({ ...body, event });

      const { data, error } = await ctx.supabase
        .from('generated_content')
        .insert(
          stripUndefined({
            workspace_id: workspaceId,
            event_id: event?.id || body.eventId || body.event_id || null,
            content_type: generated.contentType || body.contentType || body.type || 'social_post',
            title: generated.title || 'Generated content',
            body: generated.body || generated.content || '',
            status: 'draft',
            created_by: ctx.user.id,
          })
        )
        .select('*')
        .single();

      if (error) throw error;

      await writeAudit(ctx, 'ai.content.generated', 'generated_content', data.id, {
        source: getOpenAI() ? 'openai' : 'fallback',
        model: getOpenAI() ? AI_MODEL : 'rule-based',
        contentType: generated.contentType,
      });

      return ok({ ...generated, saved: mapContent(data) });
    }

        if (path[0] === 'approvals' && path[2] === 'approve') {
      const { data, error } = await ctx.supabase
        .from('ai_approvals')
        .update({
          status: 'approved',
          reviewed_by: ctx.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('workspace_id', workspaceId)
        .eq('id', path[1])
        .select('*')
        .single();

      if (error) throw error;

      if (data?.message_id) {
        await ctx.supabase
          .from('messages')
          .update({
            status: 'approved',
            updated_at: new Date().toISOString(),
          })
          .eq('workspace_id', workspaceId)
          .eq('id', data.message_id);
      }

      await writeAudit(ctx, 'ai.reply.approved', 'ai_approval', data.id, {
        risk_level: data.risk_level,
        message_id: data.message_id,
      });

      return ok(mapApproval(data));
    }

    if (path[0] === 'approvals' && path[2] === 'reject') {
      const { data, error } = await ctx.supabase
        .from('ai_approvals')
        .update({
          status: 'rejected',
          reviewed_by: ctx.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('workspace_id', workspaceId)
        .eq('id', path[1])
        .select('*')
        .single();

      if (error) throw error;

      if (data?.message_id) {
        await ctx.supabase
          .from('messages')
          .update({
            status: 'rejected',
            updated_at: new Date().toISOString(),
          })
          .eq('workspace_id', workspaceId)
          .eq('id', data.message_id);
      }

      await writeAudit(ctx, 'ai.reply.rejected', 'ai_approval', data.id, {
        risk_level: data.risk_level,
        message_id: data.message_id,
      });

      return ok(mapApproval(data));
    }

    if (path[0] === 'approvals' && path[2] === 'reject') {
      const { data, error } = await ctx.supabase
        .from('ai_approvals')
        .update({
          status: 'rejected',
          reviewed_by: ctx.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('workspace_id', workspaceId)
        .eq('id', path[1])
        .select('*')
        .single();

      if (error) throw error;
      await writeAudit(ctx, 'ai.reply.rejected', 'ai_approval', data.id, { risk_level: data.risk_level });
      return ok(mapApproval(data));
    }

    return fail('Route not found', 404);
  } catch (error) {
    return fail(error, error?.message === 'Not authenticated' ? 401 : 500);
  }
}

export async function PUT(request, context) {
  try {
    const path = await getPath(context);
    const body = await request.json().catch(() => ({}));
    const ctx = await getContext();

    requireWorkspace(ctx);
    const workspaceId = ctx.workspace.id;

    if (path[0] === 'events' && path[1]) {
      const title = body.title || body.name;
      const eventDate = body.event_date || body.eventDate || body.date;

      const { data, error } = await ctx.supabase
        .from('events')
        .update(
          stripUndefined({
            title,
            name: title,
            description: body.description,
            venue: body.venue,
            city: body.city,
            starts_at: eventDate,
            event_date: eventDate,
            status: body.status,
            knowledge_base: body.knowledge_base || body.knowledgeBase,
            updated_at: new Date().toISOString(),
          })
        )
        .eq('workspace_id', workspaceId)
        .eq('id', path[1])
        .select('*')
        .single();

      if (error) throw error;
      await writeAudit(ctx, 'event.updated', 'event', data.id, { source: 'dashboard' });
      return ok(mapEvent(data));
    }

    if (path[0] === 'messages' && path[1]) {
      const { data, error } = await ctx.supabase
        .from('messages')
        .update(
          stripUndefined({
            status: body.status,
            ai_draft: body.ai_draft || body.aiDraft,
            updated_at: new Date().toISOString(),
          })
        )
        .eq('workspace_id', workspaceId)
        .eq('id', path[1])
        .select('*')
        .single();

      if (error) throw error;
      await writeAudit(ctx, 'message.updated', 'message', data.id, { status: data.status });
      return ok(mapMessage(data));
    }

    if (path[0] === 'leads' && path[1]) {
      const title = body.title || body.name;

      const { data, error } = await ctx.supabase
        .from('leads')
        .update(
          stripUndefined({
            title,
            name: body.name,
            email: body.email,
            phone: body.phone,
            source: body.source,
            stage: body.stage,
            notes: body.notes,
            confidence: body.confidence,
            updated_at: new Date().toISOString(),
          })
        )
        .eq('workspace_id', workspaceId)
        .eq('id', path[1])
        .select('*')
        .single();

      if (error) throw error;
      await writeAudit(ctx, 'lead.updated', 'lead', data.id, { stage: data.stage });
      return ok(mapLead(data));
    }

    return fail('Route not found', 404);
  } catch (error) {
    return fail(error, error?.message === 'Not authenticated' ? 401 : 500);
  }
}

export async function DELETE(request, context) {
  try {
    const path = await getPath(context);
    const ctx = await getContext();

    requireWorkspace(ctx);
    const workspaceId = ctx.workspace.id;

    if (path[0] === 'events' && path[1]) {
      const { error } = await ctx.supabase
        .from('events')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('id', path[1]);

      if (error) throw error;
      await writeAudit(ctx, 'event.deleted', 'event', path[1], { source: 'dashboard' });
      return new NextResponse(null, { status: 204 });
    }

    if (path[0] === 'content' && path[1]) {
      const { error } = await ctx.supabase
        .from('generated_content')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('id', path[1]);

      if (error) throw error;
      await writeAudit(ctx, 'content.deleted', 'generated_content', path[1], { source: 'dashboard' });
      return new NextResponse(null, { status: 204 });
    }

    return fail('Route not found', 404);
  } catch (error) {
    return fail(error, error?.message === 'Not authenticated' ? 401 : 500);
  }
}