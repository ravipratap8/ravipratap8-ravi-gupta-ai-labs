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
import { Bot, Check, Pencil, MessageSquarePlus, Sparkles, ShieldAlert, MessagesSquare } from 'lucide-react'

function Avatar({ name }) {
  const initials = (name || '?').split(' ').map((part) => part[0]).slice(0, 2).join('')
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 text-sm font-bold text-white">
      {initials}
    </span>
  )
}

export default function InboxPage() {
  const [messages, setMessages] = useState(null)
  const [events, setEvents] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [composer, setComposer] = useState({ open: false, text: '', eventId: '', name: '' })

  const load = async () => {
    const loadedMessages = await EventOps.messages().catch(() => [])
    setMessages(loadedMessages)
    if (!activeId && loadedMessages.length) setActiveId(loadedMessages[0].id)
  }

  useEffect(() => {
    load()
    EventOps.events().then(setEvents).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Voice Copilot: open the sample enquiry composer when arriving via "simulate enquiry".
  useEffect(() => {
    const action = consumeVoiceAction()
    if (action && action.actionType === 'enquiry') {
      setComposer((current) => ({ ...current, open: true }))
    }
  }, [])

  const active = messages?.find((message) => message.id === activeId)

  useEffect(() => {
    if (active) {
      setDraft(active.aiSuggestedReply)
      setEditing(false)
    }
  }, [active])

  const updateLocal = (id, patch) => {
    setMessages((currentMessages) => (currentMessages || []).map((message) => (
      message.id === id ? { ...message, ...patch } : message
    )))
  }

  const approve = async () => {
    await EventOps.approve(active.id, editing ? { editedReply: draft } : {})
    updateLocal(active.id, { status: 'Approved', aiSuggestedReply: draft })
    setEditing(false)
    toast.success('Draft approved', {
      description: 'The AI draft is approved for human-controlled follow-up.',
    })
  }

  const markHandled = async () => {
    await EventOps.updateMessage(active.id, { status: 'Sent' })
    updateLocal(active.id, { status: 'Sent' })
    toast.success('Marked as handled', {
      description: 'External message sending is not connected in this portfolio demo.',
    })
  }

  const regenerate = async () => {
    const result = await EventOps.generateReply(active.message, active.eventId)
    setDraft(result.reply)
    setEditing(true)
    toast.success('AI generated a new draft for review')
  }

  const sendComposer = async () => {
    if (!composer.text) return

    const message = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: composer.text,
        eventId: composer.eventId,
        customerName: composer.name || 'Sample Contact',
      }),
    }).then((response) => response.json())

    setComposer({ open: false, text: '', eventId: '', name: '' })
    await load()
    setActiveId(message.id)
    toast.success('Sample enquiry created', {
      description: 'AI drafted a response for human review.',
    })
  }

  if (!messages) return <Loading label="Loading AI inbox..." />

  return (
    <div>
      <PageHeader
        title="AI Enquiry Inbox"
        subtitle="Messaging-style sample enquiries with grounded AI draft replies. Nothing is sent automatically."
      >
        <Button onClick={() => setComposer((current) => ({ ...current, open: !current.open }))} variant="outline">
          <MessageSquarePlus className="mr-1.5 h-4 w-4" /> Add sample enquiry
        </Button>
      </PageHeader>

      <div className="mb-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            This inbox uses sample data to demonstrate the workflow: incoming enquiry, grounded AI draft,
            confidence score, risk level, edit option, and explicit human approval.
          </p>
        </div>
      </div>

      {composer.open && (
        <div className="mb-4 rounded-2xl border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="Sample contact name"
              value={composer.name}
              onChange={(event) => setComposer((current) => ({ ...current, name: event.target.value }))}
            />
            <Select
              value={composer.eventId}
              onValueChange={(value) => setComposer((current) => ({ ...current, eventId: value }))}
            >
              <SelectTrigger><SelectValue placeholder="Link to sample event" /></SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="e.g. Is parking available?"
              value={composer.text}
              onChange={(event) => setComposer((current) => ({ ...current, text: event.target.value }))}
              onKeyDown={(event) => event.key === 'Enter' && sendComposer()}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={sendComposer} className="bg-cyan-500 hover:bg-cyan-600">
              <Sparkles className="mr-1.5 h-4 w-4" /> Generate AI draft
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border bg-card">
          <div className="border-b p-3 text-sm font-medium text-muted-foreground">
            {messages.length} sample conversation{messages.length === 1 ? '' : 's'}
          </div>
          <div className="max-h-[600px] divide-y overflow-y-auto scrollbar-thin">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => setActiveId(message.id)}
                className={cn(
                  'flex w-full items-start gap-3 p-3 text-left transition hover:bg-slate-50',
                  activeId === message.id && 'bg-cyan-50/60',
                )}
              >
                <Avatar name={message.customerName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{message.customerName}</p>
                    {message.riskLevel === 'High' && <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{message.message}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <StatusBadge status={message.status} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {active ? (
          <div className="flex flex-col rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar name={active.customerName} />
                <div>
                  <p className="font-semibold text-foreground">{active.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {active.eventName || 'No sample event linked'} • sample messaging channel
                  </p>
                </div>
              </div>
              <CategoryBadge category={active.category} />
            </div>

            <div className="flex-1 space-y-4 bg-muted p-5" style={{ minHeight: 280 }}>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card px-4 py-2.5 text-sm text-foreground shadow-sm">
                  {active.message}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-cyan-200 bg-cyan-50 px-4 py-3 shadow-sm">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-cyan-700">
                    <Bot className="h-3.5 w-3.5" /> AI-drafted response
                  </div>
                  {editing ? (
                    <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={5} className="bg-card text-sm" />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-foreground">{draft}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Confidence value={active.confidence} />
                    <RiskBadge level={active.riskLevel} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t p-4">
              <StatusBadge status={active.status} />
              <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={regenerate}>
                  <Sparkles className="mr-1.5 h-4 w-4" /> Regenerate
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing((value) => !value)}>
                  <Pencil className="mr-1.5 h-4 w-4" /> {editing ? 'Editing...' : 'Edit'}
                </Button>
                {active.status !== 'Approved' && active.status !== 'Sent' && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={approve}>
                    <Check className="mr-1.5 h-4 w-4" /> Approve draft
                  </Button>
                )}
                {active.status === 'Approved' && (
                  <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600" onClick={markHandled}>
                    <Check className="mr-1.5 h-4 w-4" /> Mark handled
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState icon={MessagesSquare} title="No conversation selected" desc="Pick a sample conversation from the list." />
        )}
      </div>
    </div>
  )
}
