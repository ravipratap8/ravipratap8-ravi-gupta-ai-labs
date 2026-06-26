'use client'

import { useEffect, useMemo, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { consumeVoiceAction } from '@/lib/voice/voiceActions'
import {
  PageHeader,
  RiskBadge,
  CategoryBadge,
  Confidence,
  Loading,
  EmptyState,
} from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  ShieldCheck,
  Check,
  X,
  Pencil,
  Bot,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'

function normaliseApproval(item) {
  const linkedMessage = item.linkedMessage || item.messageObject || null
  const messageText =
    item.customerMessage ||
    item.messageText ||
    item.message ||
    linkedMessage?.customerMessage ||
    linkedMessage?.customer_message ||
    'No incoming message captured'

  const draftText =
    item.aiDraft ||
    item.aiOutput ||
    item.aiSuggestedReply ||
    item.ai_output ||
    linkedMessage?.aiDraft ||
    linkedMessage?.ai_draft ||
    'No AI draft captured'

  return {
    ...item,
    customerName:
      item.customerName ||
      item.customer_name ||
      linkedMessage?.customerName ||
      linkedMessage?.customer_name ||
      'Customer',
    eventName:
      item.eventName ||
      item.event?.title ||
      item.event?.name ||
      item.messages?.events?.title ||
      item.messages?.events?.name ||
      'No sample event linked',
    messageText,
    draftText,
    riskLevel:
      item.riskLevel ||
      item.risk_level ||
      linkedMessage?.riskLevel ||
      linkedMessage?.risk_level ||
      'medium',
    category:
      item.category ||
      linkedMessage?.category ||
      'General',
    confidence:
      item.confidence ??
      linkedMessage?.confidence ??
      0,
  }
}

export default function ApprovalsPage() {
  const [items, setItems] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [savingId, setSavingId] = useState(null)

  const load = async () => {
    try {
      const data = await EventOps.approvals()
      setItems((data || []).map(normaliseApproval))
    } catch {
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  const pendingItems = useMemo(
    () => (items || []).filter((item) => item.status !== 'approved' && item.status !== 'rejected'),
    [items]
  )

  const [pendingDecision, setPendingDecision] = useState(null)

  useEffect(() => {
    const action = consumeVoiceAction()
    if (action && action.actionType === 'approval' && action.payload?.decision) {
      setPendingDecision(action.payload.decision)
    }
  }, [])

  useEffect(() => {
    if (pendingDecision && pendingItems.length) {
      const first = pendingItems[0]
      if (pendingDecision === 'approve') approve(first, false)
      else reject(first)
      setPendingDecision(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingDecision, pendingItems])

  const approve = async (approval, edited) => {
    try {
      setSavingId(approval.id)

      await EventOps.approve(
        approval.id,
        edited
          ? {
              editedReply: editText,
              aiDraft: editText,
              aiOutput: editText,
            }
          : {}
      )

      setEditId(null)
      setEditText('')
      setItems((list) => (list || []).filter((item) => item.id !== approval.id))

      toast.success('Draft approved', {
        description: `AI draft for ${approval.customerName} approved for human-controlled follow-up.`,
      })
    } catch (error) {
      toast.error('Approval failed', {
        description: error?.message || 'Unable to approve draft.',
      })
    } finally {
      setSavingId(null)
    }
  }

  const reject = async (approval) => {
    try {
      setSavingId(approval.id)

      await EventOps.reject(approval.id)

      setItems((list) => (list || []).filter((item) => item.id !== approval.id))

      toast('Draft rejected', {
        description: 'Returned to the draft queue for review and rework.',
      })
    } catch (error) {
      toast.error('Reject failed', {
        description: error?.message || 'Unable to reject draft.',
      })
    } finally {
      setSavingId(null)
    }
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
          <strong>{pendingItems.length}</strong> AI draft{pendingItems.length === 1 ? '' : 's'} awaiting review.
          Higher-risk items such as complaints, refunds, or unclear policy questions are prioritised for human approval.
        </p>
      </div>

      {pendingItems.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="All caught up"
          desc="There are no AI drafts waiting for approval in this demo queue."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {pendingItems.map((approval) => (
            <div key={approval.id} className="flex flex-col rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <p className="font-semibold text-foreground">{approval.customerName}</p>
                  <p className="text-xs text-muted-foreground">{approval.eventName}</p>
                </div>
                <RiskBadge level={approval.riskLevel} />
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" /> Incoming message
                  </p>
                  <p className="rounded-xl bg-muted p-3 text-sm text-foreground">
                    {approval.messageText}
                  </p>
                </div>

                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-cyan-700">
                    <Bot className="h-3.5 w-3.5" /> AI-drafted response
                  </p>

                  {editId === approval.id ? (
                    <Textarea
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      rows={5}
                      className="text-sm"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-foreground">
                      {approval.draftText}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Confidence value={approval.confidence} />
                  <CategoryBadge category={approval.category} />
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t p-4">
                {editId === approval.id ? (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={savingId === approval.id}
                      onClick={() => approve(approval, true)}
                    >
                      <Check className="mr-1.5 h-4 w-4" />
                      {savingId === approval.id ? 'Saving...' : 'Save and approve'}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={savingId === approval.id}
                      onClick={() => {
                        setEditId(null)
                        setEditText('')
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={savingId === approval.id}
                      onClick={() => approve(approval, false)}
                    >
                      <Check className="mr-1.5 h-4 w-4" />
                      {savingId === approval.id ? 'Approving...' : 'Approve draft'}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={savingId === approval.id}
                      onClick={() => {
                        setEditId(approval.id)
                        setEditText(approval.draftText)
                      }}
                    >
                      <Pencil className="mr-1.5 h-4 w-4" /> Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={savingId === approval.id}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => reject(approval)}
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