'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { consumeVoiceAction } from '@/lib/voice/voiceActions'
import { PageHeader, RiskBadge, CategoryBadge, Confidence, Loading, EmptyState } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ShieldCheck, Check, X, Pencil, Bot, MessageSquare, CheckCircle2 } from 'lucide-react'

export default function ApprovalsPage() {
  const [items, setItems] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  const load = () => EventOps.approvals().then(setItems).catch(() => setItems([]))
  useEffect(() => { load() }, [])

  // Voice Copilot: act on the top card when arriving via a confirmed voice approval or reject action.
  const [pendingDecision, setPendingDecision] = useState(null)
  useEffect(() => {
    const action = consumeVoiceAction()
    if (action && action.actionType === 'approval' && action.payload?.decision) {
      setPendingDecision(action.payload.decision)
    }
  }, [])

  useEffect(() => {
    if (pendingDecision && items && items.length) {
      const first = items[0]
      if (pendingDecision === 'approve') approve(first, false)
      else reject(first)
      setPendingDecision(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingDecision, items])

  const approve = async (message, edited) => {
    await EventOps.approve(message.id, edited ? { editedReply: editText } : {})
    setEditId(null)
    setItems((list) => list.filter((item) => item.id !== message.id))
    toast.success('Draft approved', {
      description: `AI draft for ${message.customerName} approved for human-controlled follow-up.`,
    })
  }

  const reject = async (message) => {
    await EventOps.reject(message.id)
    setItems((list) => list.filter((item) => item.id !== message.id))
    toast('Draft rejected', {
      description: 'Returned to the draft queue for review and rework.',
    })
  }

  if (!items) return <Loading label="Loading approval queue..." />

  return (
    <div>
      <PageHeader
        title="AI Approval Queue"
        subtitle="Human-in-the-loop review for AI-drafted responses. AI drafts are never sent automatically."
      />

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <strong>{items.length}</strong> AI draft{items.length === 1 ? '' : 's'} awaiting review.
          Higher-risk items such as complaints, refunds, or unclear policy questions are prioritised for human approval.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="All caught up"
          desc="There are no AI drafts waiting for approval in this demo queue."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((message) => (
            <div key={message.id} className="flex flex-col rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <p className="font-semibold text-foreground">{message.customerName}</p>
                  <p className="text-xs text-muted-foreground">{message.eventName || 'No sample event linked'}</p>
                </div>
                <RiskBadge level={message.riskLevel} />
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" /> Incoming message
                  </p>
                  <p className="rounded-xl bg-muted p-3 text-sm text-foreground">{message.message}</p>
                </div>

                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-cyan-700">
                    <Bot className="h-3.5 w-3.5" /> AI-drafted response
                  </p>
                  {editId === message.id ? (
                    <Textarea
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      rows={5}
                      className="text-sm"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-foreground">
                      {message.aiSuggestedReply}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Confidence value={message.confidence} />
                  <CategoryBadge category={message.category} />
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t p-4">
                {editId === message.id ? (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => approve(message, true)}
                    >
                      <Check className="mr-1.5 h-4 w-4" /> Save and approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => approve(message, false)}
                    >
                      <Check className="mr-1.5 h-4 w-4" /> Approve draft
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditId(message.id)
                        setEditText(message.aiSuggestedReply)
                      }}
                    >
                      <Pencil className="mr-1.5 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => reject(message)}
                    >
                      <X className="mr-1.5 h-4 w-4" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
