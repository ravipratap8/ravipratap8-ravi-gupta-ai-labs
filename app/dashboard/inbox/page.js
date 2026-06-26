'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { consumeVoiceAction } from '@/lib/voice/voiceActions'
import {
  PageHeader,
  StatusBadge,
  RiskBadge,
  CategoryBadge,
  Confidence,
  Loading,
  EmptyState,
} from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Bot,
  Check,
  Pencil,
  MessageSquarePlus,
  Sparkles,
  ShieldAlert,
  MessagesSquare,
} from 'lucide-react'

function Avatar({ name }) {
  const initials = (name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 text-sm font-bold text-white">
      {initials}
    </span>
  )
}

function normaliseStatus(status) {
  return String(status || 'drafted').toLowerCase()
}

function normaliseMessage(message) {
  const messageText =
    message.customerMessage ||
    message.customer_message ||
    message.messageText ||
    message.message ||
    'No incoming message captured'

  const aiDraft =
    message.aiDraft ||
    message.ai_draft ||
    message.aiSuggestedReply ||
    message.aiOutput ||
    message.ai_output ||
    'No AI draft captured'

  return {
    ...message,
    customerName: message.customerName || message.customer_name || 'Customer',
    eventId: message.eventId || message.event_id || null,
    eventName:
      message.eventName ||
      message.event?.title ||
      message.event?.name ||
      message.events?.title ||
      message.events?.name ||
      'No sample event linked',
    messageText,
    aiDraft,
    aiSuggestedReply: aiDraft,
    riskLevel: message.riskLevel || message.risk_level || 'medium',
    category: message.category || 'General',
    confidence: message.confidence ?? 0,
    status: message.status || 'drafted',
  }
}

export default function InboxPage() {
  const [messages, setMessages] = useState(null)
  const [events, setEvents] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [composer, setComposer] = useState({
    open: false,
    text: '',
    eventId: '',
    name: '',
  })

  const load = async (preferredId = null) => {
    const loadedMessages = await EventOps.messages().catch(() => [])
    const normalised = (loadedMessages || []).map(normaliseMessage)

    setMessages(normalised)

    if (preferredId && normalised.some((message) => message.id === preferredId)) {
      setActiveId(preferredId)
      return
    }

    if (!activeId && normalised.length) {
      setActiveId(normalised[0].id)
      return
    }

    if (activeId && !normalised.some((message) => message.id === activeId)) {
      setActiveId(normalised[0]?.id || null)
    }
  }

  useEffect(() => {
    load()
    EventOps.events().then(setEvents).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const action = consumeVoiceAction()
    if (action && action.actionType === 'enquiry') {
      setComposer((current) => ({ ...current, open: true }))
    }
  }, [])

  const active = messages?.find((message) => message.id === activeId)

  useEffect(() => {
    if (active) {
      setDraft(active.aiDraft || active.aiSuggestedReply || '')
      setEditing(false)
    }
  }, [active])

  const updateLocal = (id, patch) => {
    setMessages((currentMessages) =>
      (currentMessages || []).map((message) =>
        message.id === id ? normaliseMessage({ ...message, ...patch }) : message
      )
    )
  }

  const findApprovalForMessage = async (messageId) => {
    const approvals = await EventOps.approvals().catch(() => [])

    return (approvals || []).find((approval) => {
      const status = normaliseStatus(approval.status)
      const linkedMessageId =
        approval.message_id ||
        approval.messageId ||
        approval.linkedMessage?.id ||
        approval.messageObject?.id

      return status === 'pending' && linkedMessageId === messageId
    })
  }

  const approve = async () => {
    if (!active || busy) return

    try {
      setBusy(true)

      const approval = await findApprovalForMessage(active.id)

      if (approval?.id) {
        await EventOps.approve(
          approval.id,
          editing
            ? {
                editedReply: draft,
                aiDraft: draft,
                aiOutput: draft,
              }
            : {}
        )
      }

      await EventOps.updateMessage(active.id, {
        status: 'approved',
        aiDraft: draft,
        ai_draft: draft,
      }).catch(() => {})

      updateLocal(active.id, {
        status: 'approved',
        aiDraft: draft,
        aiSuggestedReply: draft,
      })

      setEditing(false)

      toast.success('Draft approved', {
        description: 'The AI draft is approved for human-controlled follow-up.',
      })
    } catch (error) {
      toast.error('Approval failed', {
        description: error?.message || 'Unable to approve this draft.',
      })
    } finally {
      setBusy(false)
    }
  }

  const markHandled = async () => {
    if (!active || busy) return

    try {
      setBusy(true)

      await EventOps.updateMessage(active.id, { status: 'sent' })
      updateLocal(active.id, { status: 'sent' })

      toast.success('Marked as handled', {
        description: 'External message sending is not connected in this portfolio demo.',
      })
    } catch (error) {
      toast.error('Update failed', {
        description: error?.message || 'Unable to mark this enquiry as handled.',
      })
    } finally {
      setBusy(false)
    }
  }

  const regenerate = async () => {
    if (!active || busy) return

    try {
      setBusy(true)

      const result = await EventOps.generateReply(active.messageText, active.eventId)

      if (result?.message?.id) {
        await load(result.message.id)
      } else {
        setDraft(result.reply || result.draft || '')
        setEditing(true)
      }

      toast.success('AI generated a new draft for review')
    } catch (error) {
      toast.error('Regenerate failed', {
        description: error?.message || 'Unable to regenerate AI draft.',
      })
    } finally {
      setBusy(false)
    }
  }

  const sendComposer = async () => {
    if (!composer.text.trim()) {
      toast.error('Enter a sample enquiry first')
      return
    }

    try {
      setBusy(true)

      const result = await EventOps.generateReply(composer.text, composer.eventId || null)
      const newMessageId = result?.message?.id

      setComposer({ open: false, text: '', eventId: '', name: '' })

      await load(newMessageId)

      toast.success('Sample enquiry created', {
        description: 'AI drafted a response for human review.',
      })
    } catch (error) {
      toast.error('Sample enquiry failed', {
        description: error?.message || 'Unable to create sample enquiry.',
      })
    } finally {
      setBusy(false)
    }
  }

  if (!messages) return <Loading label="Loading AI inbox..." />

  const activeStatus = normaliseStatus(active?.status)

  return (
    <div>
      <PageHeader
        title="AI Enquiry Inbox"
        subtitle="Messaging-style sample enquiries with grounded AI draft replies. Nothing is sent automatically."
      >
        <Button
          onClick={() => setComposer((current) => ({ ...current, open: !current.open }))}
          variant="outline"
        >
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
              onChange={(event) =>
                setComposer((current) => ({ ...current, name: event.target.value }))
              }
            />

            <Select
              value={composer.eventId}
              onValueChange={(value) =>
                setComposer((current) => ({ ...current, eventId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Link to sample event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name || event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="e.g. Can I get a refund if I cannot attend?"
              value={composer.text}
              onChange={(event) =>
                setComposer((current) => ({ ...current, text: event.target.value }))
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendComposer()
              }}
            />
          </div>

          <div className="mt-3 flex justify-end">
            <Button onClick={sendComposer} disabled={busy} className="bg-cyan-500 hover:bg-cyan-600">
              <Sparkles className="mr-1.5 h-4 w-4" />
              {busy ? 'Generating...' : 'Generate AI draft'}
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
                  activeId === message.id && 'bg-cyan-50/60'
                )}
              >
                <Avatar name={message.customerName} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {message.customerName}
                    </p>
                    {String(message.riskLevel).toLowerCase() === 'high' && (
                      <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                    )}
                  </div>

                  <p className="truncate text-sm text-muted-foreground">{message.messageText}</p>

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
                    {active.eventName} • sample messaging channel
                  </p>
                </div>
              </div>

              <CategoryBadge category={active.category} />
            </div>

            <div className="flex-1 space-y-4 bg-muted p-5" style={{ minHeight: 280 }}>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card px-4 py-2.5 text-sm text-foreground shadow-sm">
                  {active.messageText}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-cyan-200 bg-cyan-50 px-4 py-3 shadow-sm">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-cyan-700">
                    <Bot className="h-3.5 w-3.5" /> AI-drafted response
                  </div>

                  {editing ? (
                    <Textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      rows={5}
                      className="bg-card text-sm"
                    />
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
                <Button variant="outline" size="sm" disabled={busy} onClick={regenerate}>
                  <Sparkles className="mr-1.5 h-4 w-4" /> Regenerate
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => setEditing((value) => !value)}
                >
                  <Pencil className="mr-1.5 h-4 w-4" /> {editing ? 'Editing...' : 'Edit'}
                </Button>

                {activeStatus !== 'approved' && activeStatus !== 'sent' && (
                  <Button
                    size="sm"
                    disabled={busy}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={approve}
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    {busy ? 'Approving...' : 'Approve draft'}
                  </Button>
                )}

                {activeStatus === 'approved' && (
                  <Button
                    size="sm"
                    disabled={busy}
                    className="bg-cyan-500 hover:bg-cyan-600"
                    onClick={markHandled}
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    {busy ? 'Saving...' : 'Mark handled'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={MessagesSquare}
            title="No conversation selected"
            desc="Pick a sample conversation from the list."
          />
        )}
      </div>
    </div>
  )
}