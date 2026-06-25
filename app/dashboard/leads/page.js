'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { PageHeader, CategoryBadge, Loading } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Plus, ChevronRight, ChevronLeft, DollarSign, Mail } from 'lucide-react'

const STAGES = ['New', 'Contacted', 'Interested', 'Converted', 'Closed']
const STAGE_COLOR = {
  New: 'border-t-slate-400', Contacted: 'border-t-blue-400', Interested: 'border-t-violet-400',
  Converted: 'border-t-emerald-500', Closed: 'border-t-slate-300',
}
const CATEGORIES = ['Hot Lead', 'General Enquiry', 'Complaint', 'Refund Request', 'Sponsorship Enquiry', 'Vendor Enquiry', 'Group Booking']

export default function LeadsPage() {
  const [leads, setLeads] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', category: 'Hot Lead', value: '', note: '' })

  const load = () => EventOps.leads().then(setLeads).catch(() => setLeads([]))
  useEffect(() => { load() }, [])

  const move = async (lead, dir) => {
    const idx = STAGES.indexOf(lead.stage)
    const next = STAGES[Math.min(STAGES.length - 1, Math.max(0, idx + dir))]
    if (next === lead.stage) return
    setLeads((l) => l.map((x) => (x.id === lead.id ? { ...x, stage: next } : x)))
    await EventOps.updateLead(lead.id, { stage: next })
  }
  const add = async () => {
    if (!form.name) { toast.error('Name required'); return }
    await EventOps.createLead(form)
    setOpen(false); setForm({ name: '', email: '', category: 'Hot Lead', value: '', note: '' })
    toast.success('Lead added')
    load()
  }

  if (!leads) return <Loading label="Loading leads…" />
  const pipelineValue = leads.filter((l) => l.stage !== 'Closed').reduce((s, l) => s + (l.value || 0), 0)

  return (
    <div>
      <PageHeader title="Smart Lead Capture" subtitle={`CRM pipeline • $${pipelineValue.toLocaleString()} open pipeline value`}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-cyan-500 hover:bg-cyan-600"><Plus className="mr-1.5 h-4 w-4" /> Add lead</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add lead</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Value ($)</Label><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label>Note</Label><Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={add} className="bg-cyan-500 hover:bg-cyan-600">Add lead</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {STAGES.map((stage) => {
          const col = leads.filter((l) => l.stage === stage)
          return (
            <div key={stage} className={cn('rounded-2xl border border-t-4 bg-muted/60 p-3', STAGE_COLOR[stage])}>
              <div className="mb-3 flex items-center justify-between px-1"><h3 className="text-sm font-semibold text-foreground">{stage}</h3><span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">{col.length}</span></div>
              <div className="space-y-2.5">
                {col.map((l) => (
                  <div key={l.id} className="rounded-xl border bg-card p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-foreground">{l.name}</p>{l.value > 0 && <span className="flex items-center text-xs font-medium text-emerald-600"><DollarSign className="h-3 w-3" />{l.value.toLocaleString()}</span>}</div>
                    <div className="mt-1.5"><CategoryBadge category={l.category} /></div>
                    {l.eventName && <p className="mt-1.5 truncate text-xs text-muted-foreground">{l.eventName}</p>}
                    {l.email && <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground"><Mail className="h-3 w-3" />{l.email}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <button onClick={() => move(l, -1)} disabled={stage === 'New'} className="rounded p-1 text-slate-400 hover:bg-muted disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
                      <button onClick={() => move(l, 1)} disabled={stage === 'Closed'} className="rounded p-1 text-slate-400 hover:bg-muted disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
                {col.length === 0 && <p className="px-1 py-6 text-center text-xs text-muted-foreground">No leads</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
