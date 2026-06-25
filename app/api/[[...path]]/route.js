import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { buildSeedData } from '@/lib/mock-data'
import { classifyMessage, generateReply, generateContent, getContentTypes } from '@/lib/ai/mock-engine'
import { getToolManifest } from '@/lib/mcp/tools'

// ---------------------------------------------------------------------------
// MongoDB connection (reused across requests)
// ---------------------------------------------------------------------------
let dbPromise

async function connectToMongo() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const client = new MongoClient(process.env.MONGO_URL)
      await client.connect()
      const database = client.db(process.env.DB_NAME)
      await ensureSeeded(database)
      return database
    })().catch((err) => {
      // Reset so a later request can retry the connection.
      dbPromise = undefined
      throw err
    })
  }
  return dbPromise
}

// Lazy seed: only insert mock data the first time the collections are empty.
async function ensureSeeded(database) {
  const count = await database.collection('events').countDocuments()
  if (count > 0) return
  const { events, messages, leads, contentGenerations, auditLogs } = buildSeedData()
  await database.collection('events').insertMany(events)
  await database.collection('messages').insertMany(messages)
  await database.collection('leads').insertMany(leads)
  await database.collection('content_generations').insertMany(contentGenerations)
  await database.collection('audit_logs').insertMany(auditLogs)
}

async function addAudit(database, { action, actor, detail, riskLevel = 'Low' }) {
  await database.collection('audit_logs').insertOne({
    id: uuidv4(),
    action,
    actor,
    detail,
    riskLevel,
    createdAt: new Date().toISOString(),
  })
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

const json = (data, status = 200) => handleCORS(NextResponse.json(data, { status }))
const clean = (doc) => {
  if (!doc) return doc
  const { _id, ...rest } = doc
  return rest
}
const cleanArr = (arr) => arr.map(clean)

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method
  const url = new URL(request.url)

  try {
    const db = await connectToMongo()

    // -- Health -----------------------------------------------------------
    if ((route === '/' || route === '/root') && method === 'GET') {
      return json({ message: 'AI EventOps Assistant API', status: 'ok', app: 'ravigupta.dev' })
    }

    // -- Force reseed (demo helper) --------------------------------------
    if (route === '/seed' && method === 'POST') {
      for (const c of ['events', 'messages', 'leads', 'content_generations', 'audit_logs']) {
        await db.collection(c).deleteMany({})
      }
      await ensureSeeded(db)
      return json({ message: 'Reseeded mock data' })
    }

    // -- Dashboard stats --------------------------------------------------
    if (route === '/dashboard/stats' && method === 'GET') {
      const [events, messages, leads, contents] = await Promise.all([
        db.collection('events').find({}).toArray(),
        db.collection('messages').find({}).toArray(),
        db.collection('leads').find({}).toArray(),
        db.collection('content_generations').find({}).toArray(),
      ])
      const pendingApprovals = messages.filter((m) => ['Draft', 'Needs Review'].includes(m.status)).length
      const newEnquiries = messages.filter((m) => ['Draft', 'Needs Review'].includes(m.status)).length
      const hotLeads = leads.filter((l) => l.category === 'Hot Lead').length
      const highRisk = messages.filter((m) => m.riskLevel === 'High' && ['Draft', 'Needs Review'].includes(m.status)).length
      const recent = await db.collection('audit_logs').find({}).sort({ createdAt: -1 }).limit(6).toArray()
      return json({
        totalEvents: events.length,
        publishedEvents: events.filter((e) => e.status === 'Published').length,
        pendingApprovals,
        newEnquiries,
        hotLeads,
        totalLeads: leads.length,
        contentGenerated: contents.length,
        aiSafety: {
          humanInLoop: true,
          highRiskQueued: highRisk,
          status: highRisk > 0 ? 'Action needed' : 'All clear',
        },
        recentActivity: cleanArr(recent),
      })
    }

    // -- Events -----------------------------------------------------------
    if (route === '/events' && method === 'GET') {
      const q = (url.searchParams.get('q') || '').toLowerCase()
      const status = url.searchParams.get('status')
      const filter = {}
      if (status && status !== 'all') filter.status = status
      let events = await db.collection('events').find(filter).sort({ createdAt: -1 }).toArray()
      if (q) events = events.filter((e) => `${e.name} ${e.city} ${e.venue}`.toLowerCase().includes(q))
      return json(cleanArr(events))
    }

    if (route === '/events' && method === 'POST') {
      const body = await request.json()
      if (!body.name) return json({ error: 'name is required' }, 400)
      const event = {
        id: uuidv4(),
        name: body.name,
        date: body.date || '',
        venue: body.venue || '',
        city: body.city || '',
        flyerImage: body.flyerImage || '',
        ticketLink: body.ticketLink || '',
        organiserName: body.organiserName || 'Ravi Events Co.',
        organiserEmail: body.organiserEmail || '',
        artistDetails: body.artistDetails || '',
        faq: Array.isArray(body.faq) ? body.faq : [],
        refundPolicy: body.refundPolicy || '',
        parkingInfo: body.parkingInfo || '',
        meetGreet: body.meetGreet || '',
        status: body.status || 'Draft',
        createdAt: new Date().toISOString(),
      }
      await db.collection('events').insertOne(event)
      await addAudit(db, { action: 'event.created', actor: 'Ravi Gupta', detail: `Created event "${event.name}"` })
      return json(clean(event), 201)
    }

    if (path[0] === 'events' && path[1] && method === 'GET') {
      const event = await db.collection('events').findOne({ id: path[1] })
      if (!event) return json({ error: 'Event not found' }, 404)
      const messages = await db.collection('messages').find({ eventId: path[1] }).toArray()
      return json({ ...clean(event), messages: cleanArr(messages) })
    }

    if (path[0] === 'events' && path[1] && method === 'PUT') {
      const body = await request.json()
      delete body._id
      delete body.id
      await db.collection('events').updateOne({ id: path[1] }, { $set: body })
      const updated = await db.collection('events').findOne({ id: path[1] })
      if (!updated) return json({ error: 'Event not found' }, 404)
      await addAudit(db, { action: 'event.updated', actor: 'Ravi Gupta', detail: `Updated event "${updated.name}"` })
      return json(clean(updated))
    }

    if (path[0] === 'events' && path[1] && method === 'DELETE') {
      await db.collection('events').deleteOne({ id: path[1] })
      return json({ message: 'deleted' })
    }

    // -- Messages (AI Inbox) ---------------------------------------------
    if (route === '/messages' && method === 'GET') {
      const eventId = url.searchParams.get('eventId')
      const status = url.searchParams.get('status')
      const filter = {}
      if (eventId) filter.eventId = eventId
      if (status && status !== 'all') filter.status = status
      const messages = await db.collection('messages').find(filter).sort({ createdAt: -1 }).toArray()
      return json(cleanArr(messages))
    }

    if (route === '/messages' && method === 'POST') {
      const body = await request.json()
      if (!body.message) return json({ error: 'message is required' }, 400)
      const event = body.eventId ? await db.collection('events').findOne({ id: body.eventId }) : null
      const ai = generateReply(body.message, event)
      const msg = {
        id: uuidv4(),
        customerName: body.customerName || 'New Customer',
        channel: body.channel || 'whatsapp',
        message: body.message,
        eventId: body.eventId || '',
        eventName: event?.name || '',
        aiSuggestedReply: ai.reply,
        confidence: ai.confidence,
        category: ai.category,
        riskLevel: ai.riskLevel,
        status: 'Needs Review',
        createdAt: new Date().toISOString(),
      }
      await db.collection('messages').insertOne(msg)
      await addAudit(db, { action: 'ai.reply.generated', actor: 'AI Assistant', detail: `Draft reply generated for ${msg.customerName}`, riskLevel: ai.riskLevel })
      return json(clean(msg), 201)
    }

    if (path[0] === 'messages' && path[1] && method === 'PUT') {
      const body = await request.json()
      delete body._id
      delete body.id
      await db.collection('messages').updateOne({ id: path[1] }, { $set: body })
      const updated = await db.collection('messages').findOne({ id: path[1] })
      if (!updated) return json({ error: 'Message not found' }, 404)
      return json(clean(updated))
    }

    // -- Approvals --------------------------------------------------------
    if (route === '/approvals' && method === 'GET') {
      const messages = await db
        .collection('messages')
        .find({ status: { $in: ['Draft', 'Needs Review'] } })
        .sort({ riskLevel: -1, createdAt: -1 })
        .toArray()
      return json(cleanArr(messages))
    }

    if (path[0] === 'approvals' && path[1] && path[2] === 'approve' && method === 'POST') {
      const body = await request.json().catch(() => ({}))
      const set = { status: 'Approved' }
      if (body.editedReply) set.aiSuggestedReply = body.editedReply
      await db.collection('messages').updateOne({ id: path[1] }, { $set: set })
      const updated = await db.collection('messages').findOne({ id: path[1] })
      if (!updated) return json({ error: 'Message not found' }, 404)
      await addAudit(db, { action: 'approval.approved', actor: 'Ravi Gupta', detail: `Approved reply to ${updated.customerName}`, riskLevel: updated.riskLevel })
      return json(clean(updated))
    }

    if (path[0] === 'approvals' && path[1] && path[2] === 'reject' && method === 'POST') {
      await db.collection('messages').updateOne({ id: path[1] }, { $set: { status: 'Draft' } })
      const updated = await db.collection('messages').findOne({ id: path[1] })
      if (!updated) return json({ error: 'Message not found' }, 404)
      await addAudit(db, { action: 'approval.rejected', actor: 'Ravi Gupta', detail: `Rejected AI draft for ${updated.customerName}`, riskLevel: updated.riskLevel })
      return json(clean(updated))
    }

    // -- AI endpoints (mock) ---------------------------------------------
    if (route === '/ai/classify-message' && method === 'POST') {
      const body = await request.json()
      return json(classifyMessage(body.message || ''))
    }

    if (route === '/ai/chat' && method === 'POST') {
      const body = await request.json()
      const event = body.eventId ? await db.collection('events').findOne({ id: body.eventId }) : null
      return json(generateReply(body.message || '', event))
    }

    if (route === '/ai/generate-content' && method === 'GET') {
      return json({ types: getContentTypes() })
    }

    if (route === '/ai/generate-content' && method === 'POST') {
      const body = await request.json()
      const event = body.eventId ? await db.collection('events').findOne({ id: body.eventId }) : null
      const result = generateContent(body.type, event, body.prompt)
      return json(result)
    }

    // -- Content generations (saved) -------------------------------------
    if (route === '/content' && method === 'GET') {
      const items = await db.collection('content_generations').find({}).sort({ createdAt: -1 }).toArray()
      return json(cleanArr(items))
    }

    if (route === '/content' && method === 'POST') {
      const body = await request.json()
      const item = {
        id: uuidv4(),
        eventId: body.eventId || '',
        eventName: body.eventName || '',
        type: body.type || 'Content',
        prompt: body.prompt || '',
        content: body.content || '',
        createdAt: new Date().toISOString(),
      }
      await db.collection('content_generations').insertOne(item)
      await addAudit(db, { action: 'content.saved', actor: 'Ravi Gupta', detail: `Saved ${item.type} for "${item.eventName}"` })
      return json(clean(item), 201)
    }

    if (path[0] === 'content' && path[1] && method === 'DELETE') {
      await db.collection('content_generations').deleteOne({ id: path[1] })
      return json({ message: 'deleted' })
    }

    // -- Leads (CRM) ------------------------------------------------------
    if (route === '/leads' && method === 'GET') {
      const leads = await db.collection('leads').find({}).sort({ createdAt: -1 }).toArray()
      return json(cleanArr(leads))
    }

    if (route === '/leads' && method === 'POST') {
      const body = await request.json()
      const cls = classifyMessage(body.note || body.message || '')
      const lead = {
        id: uuidv4(),
        name: body.name || 'New Lead',
        email: body.email || '',
        phone: body.phone || '',
        category: body.category || cls.category,
        stage: body.stage || 'New',
        eventId: body.eventId || '',
        eventName: body.eventName || '',
        value: Number(body.value) || 0,
        note: body.note || '',
        createdAt: new Date().toISOString(),
      }
      await db.collection('leads').insertOne(lead)
      await addAudit(db, { action: 'lead.created', actor: 'Ravi Gupta', detail: `New ${lead.category} lead: ${lead.name}` })
      return json(clean(lead), 201)
    }

    if (path[0] === 'leads' && path[1] && method === 'PUT') {
      const body = await request.json()
      delete body._id
      delete body.id
      await db.collection('leads').updateOne({ id: path[1] }, { $set: body })
      const updated = await db.collection('leads').findOne({ id: path[1] })
      if (!updated) return json({ error: 'Lead not found' }, 404)
      if (body.stage) await addAudit(db, { action: 'lead.moved', actor: 'Ravi Gupta', detail: `${updated.name} moved to ${body.stage}` })
      return json(clean(updated))
    }

    // -- Audit logs -------------------------------------------------------
    if (route === '/audit-logs' && method === 'GET') {
      const logs = await db.collection('audit_logs').find({}).sort({ createdAt: -1 }).limit(50).toArray()
      return json(cleanArr(logs))
    }

    // -- WhatsApp (mock placeholders) ------------------------------------
    if (route === '/whatsapp/webhook' && method === 'GET') {
      const challenge = url.searchParams.get('hub.challenge')
      const verifyToken = url.searchParams.get('hub.verify_token')
      const expected = process.env.WHATSAPP_VERIFY_TOKEN || 'demo-verify-token'
      if (verifyToken === expected) {
        return handleCORS(new NextResponse(challenge || 'ok', { status: 200 }))
      }
      return json({ error: 'verify token mismatch' }, 403)
    }

    if (route === '/whatsapp/webhook' && method === 'POST') {
      const body = await request.json().catch(() => ({}))
      const text = body?.message?.text || body?.text || 'Hello'
      const from = body?.message?.from || body?.from || 'WhatsApp User'
      const eventId = body?.eventId || ''
      const event = eventId ? await db.collection('events').findOne({ id: eventId }) : null
      const ai = generateReply(text, event)
      const msg = {
        id: uuidv4(),
        customerName: from,
        channel: 'whatsapp',
        message: text,
        eventId,
        eventName: event?.name || '',
        aiSuggestedReply: ai.reply,
        confidence: ai.confidence,
        category: ai.category,
        riskLevel: ai.riskLevel,
        status: 'Needs Review',
        createdAt: new Date().toISOString(),
      }
      await db.collection('messages').insertOne(msg)
      return json({ received: true, parsed: { from, text }, draftCreated: clean(msg) })
    }

    if (route === '/whatsapp/send' && method === 'POST') {
      const body = await request.json().catch(() => ({}))
      return json({
        success: true,
        provider: 'whatsapp-cloud-api (mock)',
        to: body.to || 'unknown',
        message: body.message || '',
        messageId: `wamid.mock_${uuidv4()}`,
        note: 'No real message sent. Configure WHATSAPP_ACCESS_TOKEN to enable.',
      })
    }

    // -- MCP --------------------------------------------------------------
    if (route === '/mcp' && method === 'GET') {
      return json({
        protocol: 'Model Context Protocol (placeholder)',
        ready: true,
        tools: getToolManifest(),
      })
    }

    if (route === '/mcp' && method === 'POST') {
      const body = await request.json().catch(() => ({}))
      const tool = getToolManifest().find((t) => t.name === body.tool)
      if (!tool) return json({ error: `Unknown tool: ${body.tool}` }, 404)
      return json({ tool: tool.name, invoked: true, mock: true, result: tool.sampleResponse })
    }

    return json({ error: `Route ${route} not found` }, 404)
  } catch (error) {
    console.error('API Error:', error)
    return json({ error: 'Internal server error', detail: String(error?.message || error) }, 500)
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
