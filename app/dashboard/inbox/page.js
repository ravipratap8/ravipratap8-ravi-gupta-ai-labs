'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { consumeVoiceAction } from '@/lib/voice/voiceActions'
import { PageHeader, StatusBadge, RiskBadge, CategoryBadge, Confidence, Loading, EmptyState } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Bot, Send, Check, Pencil, MessageSquarePlus, Sparkles, ShieldAlert, MessagesSquare } from 'lucide-react'

function Avatar({ name }) {
  const initials = (name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('')
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 text-sm font-bold text-white">{initials}</span>
}

export default function InboxPage() {
  const [messages, setMessages] = useState(null)
  const [events, setEvents] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [composer, setComposer] = useState({ open: false, text: '', eventId: '', name: '' })

  const load = async () => {
    const m = await EventOps.messages().catch(() => [])
    setMessages(m)
    if (!activeId && m.length) setActiveId(m[0].id)
  }
  useEffect(() => { load(); EventOps.events().then(setEvents).catch(() => {}) }, [])

  // Voice Copilot: open the enquiry composer when arriving via "simulate enquiry".
  useEffect(() => {
    const a = consumeVoiceAction()
    if (a && a.actionType === 'enquiry') setComposer((c) => ({ ...c, open: true }))
  }, [])

  const active = messages?.find((m) => m.id === activeId)
  useEffect(() => { if (active) { setDraft(active.aiSuggestedReply); setEditing(false) } }, [activeId])

  const updateLocal = (id, patch) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)))

  const approve = async () => {
    await EventOps.approve(active.id, editing ? { editedReply: draft } : {})
    updateLocal(active.id, { status: 'Approved', aiSuggestedReply: draft })
    setEditing(false)
    toast.success('Reply approved')
  }
  const markSent = async () => {
    await EventOps.updateMessage(active.id, { status: 'Sent' })
    updateLocal(active.id, { status: 'Sent' })
    toast.success('Marked as sent', { description: 'WhatsApp send is a placeholder.' })
  }
  const regenerate = async () => {
    const res = await EventOps.generateReply(active.message, active.eventId)
    setDraft(res.reply); setEditing(true)
    toast.success('AI re-drafted the reply')
  }

  const sendComposer = async () => {
    if (!composer.text) return
    const msg = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: composer.text, eventId: composer.eventId, customerName: composer.name || 'New Customer' }) }).then((r) => r.json())
    setComposer({ open: false, text: '', eventId: '', name: '' })
    await load()
    setActiveId(msg.id)
    toast.success('Enquiry received — AI drafted a reply')
  }

  if (!messages) return <Loading label="Loading inbox…" />

  return (
    <div>
      <PageHeader title="AI Inbox" subtitle="WhatsApp-style enquiries with grounded AI draft replies. Nothing sends without you.">
        <Button onClick={() => setComposer((c) => ({ ...c, open: !c.open }))} variant="outline"><MessageSquarePlus className="mr-1.5 h-4 w-4" /> Simulate enquiry</Button>
      </PageHeader>

      {composer.open && (
        <div className="mb-4 rounded-2xl border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="Customer name" value={composer.name} onChange={(e) => setComposer((c) => ({ ...c, name: e.target.value }))} />
            <Select value={composer.eventId} onValueChange={(v) => setComposer((c) => ({ ...c, eventId: v }))}>
              <SelectTrigger><SelectValue placeholder="Link to event" /></SelectTrigger>
              <SelectContent>{events.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="e.g. Is parking available?" value={composer.text} onChange={(e) => setComposer((c) => ({ ...c, text: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && sendComposer()} />
          </div>
          <div className="mt-3 flex justify-end"><Button onClick={sendComposer} className="bg-cyan-500 hover:bg-cyan-600"><Sparkles className="mr-1.5 h-4 w-4" /> Generate AI draft</Button></div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        {/* Conversation list */}
        <div className="rounded-2xl border bg-card">
          <div className="border-b p-3 text-sm font-medium text-muted-foreground">{messages.length} conversations</div>
          <div className="max-h-[600px] divide-y overflow-y-auto scrollbar-thin">
            {messages.map((m) => (
              <button key={m.id} onClick={() => setActiveId(m.id)} className={cn('flex w-full items-start gap-3 p-3 text-left transition hover:bg-slate-50', activeId === m.id && 'bg-cyan-50/60')}>
                <Avatar name={m.customerName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold text-foreground">{m.customerName}</p>{m.riskLevel === 'High' && <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />}</div>
                  <p className="truncate text-sm text-muted-foreground">{m.message}</p>
                  <div className="mt-1 flex items-center gap-1.5"><StatusBadge status={m.status} /></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        {active ? (
          <div className="flex flex-col rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3"><Avatar name={active.customerName} /><div><p className="font-semibold text-foreground">{active.customerName}</p><p className="text-xs text-muted-foreground">{active.eventName || 'No event linked'} • via WhatsApp</p></div></div>
              <CategoryBadge category={active.category} />
            </div>

            <div className="flex-1 space-y-4 bg-muted p-5" style={{ minHeight: 280 }}>
              <div className="flex justify-start"><div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card px-4 py-2.5 text-sm text-foreground shadow-sm">{active.message}</div></div>
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-cyan-200 bg-cyan-50 px-4 py-3 shadow-sm">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-cyan-700"><Bot className="h-3.5 w-3.5" /> AI suggested reply</div>
                  {editing ? <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} className="bg-card text-sm" /> : <p className="whitespace-pre-wrap text-sm text-foreground">{draft}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-3"><Confidence value={active.confidence} /><RiskBadge level={active.riskLevel} /></div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t p-4">
              <StatusBadge status={active.status} />
              <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={regenerate}><Sparkles className="mr-1.5 h-4 w-4" /> Regenerate</Button>
                <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}><Pencil className="mr-1.5 h-4 w-4" /> {editing ? 'Editing…' : 'Edit'}</Button>
                {active.status !== 'Approved' && active.status !== 'Sent' && <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={approve}><Check className="mr-1.5 h-4 w-4" /> Approve</Button>}
                {active.status === 'Approved' && <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600" onClick={markSent}><Send className="mr-1.5 h-4 w-4" /> Mark sent</Button>}
              </div>
            </div>
          </div>
        ) : <EmptyState icon={MessagesSquare} title="No conversation selected" desc="Pick a conversation from the list." />}
      </div>
    </div>
  )
}
