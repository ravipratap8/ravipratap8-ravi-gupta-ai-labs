'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { consumeVoiceAction } from '@/lib/voice/voiceActions'
import { PageHeader, RiskBadge, CategoryBadge, Confidence, Loading, EmptyState } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ShieldCheck, Check, X, Pencil, Bot, MessageSquare, Tag, CheckCircle2 } from 'lucide-react'

export default function ApprovalsPage() {
  const [items, setItems] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  const load = () => EventOps.approvals().then(setItems).catch(() => setItems([]))
  useEffect(() => { load() }, [])

  // Voice Copilot: act on the top card when arriving via a confirmed voice approval/reject.
  const [pendingDecision, setPendingDecision] = useState(null)
  useEffect(() => {
    const a = consumeVoiceAction()
    if (a && a.actionType === 'approval' && a.payload?.decision) setPendingDecision(a.payload.decision)
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

  const approve = async (m, edited) => {
    await EventOps.approve(m.id, edited ? { editedReply: editText } : {})
    setEditId(null)
    setItems((list) => list.filter((x) => x.id !== m.id))
    toast.success('Approved', { description: `Reply to ${m.customerName} approved.` })
  }
  const reject = async (m) => {
    await EventOps.reject(m.id)
    setItems((list) => list.filter((x) => x.id !== m.id))
    toast('Rejected', { description: 'Sent back as draft for rework.' })
  }

  if (!items) return <Loading label="Loading approvals…" />

  return (
    <div>
      <PageHeader title="Admin Approval Mode" subtitle="Human-in-the-loop review. AI never auto-sends — you approve every reply." />

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <ShieldCheck className="h-5 w-5 shrink-0" />
        <p><strong>{items.length}</strong> AI draft{items.length === 1 ? '' : 's'} awaiting approval. High-risk items (refunds, complaints) are prioritised at the top.</p>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="All caught up!" desc="There are no AI drafts waiting for approval right now." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((m) => (
            <div key={m.id} className="flex flex-col rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b p-4">
                <div><p className="font-semibold text-foreground">{m.customerName}</p><p className="text-xs text-muted-foreground">{m.eventName || 'No event'}</p></div>
                <RiskBadge level={m.riskLevel} />
              </div>
              <div className="space-y-3 p-4">
                <div><p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><MessageSquare className="h-3.5 w-3.5" /> Customer message</p><p className="rounded-xl bg-muted p-3 text-sm text-foreground">{m.message}</p></div>
                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-cyan-700"><Bot className="h-3.5 w-3.5" /> AI draft response</p>
                  {editId === m.id ? (
                    <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={5} className="text-sm" />
                  ) : (
                    <p className="whitespace-pre-wrap rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-foreground">{m.aiSuggestedReply}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Confidence value={m.confidence} />
                  <CategoryBadge category={m.category} />
                </div>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 border-t p-4">
                {editId === m.id ? (
                  <>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => approve(m, true)}><Check className="mr-1.5 h-4 w-4" /> Save & approve</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => approve(m, false)}><Check className="mr-1.5 h-4 w-4" /> Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditId(m.id); setEditText(m.aiSuggestedReply) }}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Button>
                    <Button size="sm" variant="outline" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => reject(m)}><X className="mr-1.5 h-4 w-4" /> Reject</Button>
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
