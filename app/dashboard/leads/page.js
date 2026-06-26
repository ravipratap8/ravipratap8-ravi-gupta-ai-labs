'use client'

import { useEffect, useMemo, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { PageHeader, CategoryBadge, Loading } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Mail,
  Phone,
  Building2,
} from 'lucide-react'

const STAGES = ['New', 'Contacted', 'Interested', 'Converted', 'Closed']

const STAGE_COLOR = {
  New: 'border-t-slate-400',
  Contacted: 'border-t-blue-400',
  Interested: 'border-t-violet-400',
  Converted: 'border-t-emerald-500',
  Closed: 'border-t-slate-300',
}

const CATEGORIES = [
  'Hot Lead',
  'General Enquiry',
  'Complaint',
  'Refund Request',
  'Sponsorship Enquiry',
  'Vendor Enquiry',
  'Group Booking',
]

function normaliseStage(stage) {
  const value = String(stage || 'new').trim().toLowerCase()

  if (value === 'new') return 'New'
  if (value === 'contacted') return 'Contacted'
  if (['interested', 'qualified', 'hot', 'priority'].includes(value)) return 'Interested'
  if (['converted', 'won'].includes(value)) return 'Converted'
  if (['closed', 'lost'].includes(value)) return 'Closed'

  return 'New'
}

function stageForApi(stage) {
  const value = normaliseStage(stage)

  if (value === 'New') return 'new'
  if (value === 'Contacted') return 'contacted'
  if (value === 'Interested') return 'qualified'
  if (value === 'Converted') return 'converted'
  if (value === 'Closed') return 'closed'

  return 'new'
}

function normaliseLead(lead) {
  const value = Number(lead.value || lead.pipeline_value || lead.amount || 0)

  return {
    ...lead,
    name: lead.name || lead.title || 'Untitled lead',
    title: lead.title || lead.name || 'Untitled lead',
    email: lead.email || '',
    phone: lead.phone || '',
    category: lead.category || lead.source || 'General Enquiry',
    source: lead.source || lead.category || 'manual',
    notes: lead.notes || lead.note || '',
    value: Number.isFinite(value) ? value : 0,
    uiStage: normaliseStage(lead.stage),
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Hot Lead',
    value: '',
    note: '',
  })

  const load = async () => {
    try {
      const data = await EventOps.leads()
      setLeads((data || []).map(normaliseLead))
    } catch {
      setLeads([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  const pipelineValue = useMemo(
    () =>
      (leads || [])
        .filter((lead) => lead.uiStage !== 'Closed')
        .reduce((sum, lead) => sum + Number(lead.value || 0), 0),
    [leads]
  )

  const move = async (lead, dir) => {
    const currentIndex = STAGES.indexOf(lead.uiStage)
    const nextStage = STAGES[Math.min(STAGES.length - 1, Math.max(0, currentIndex + dir))]

    if (nextStage === lead.uiStage) return

    const previousLeads = leads

    setLeads((current) =>
      (current || []).map((item) =>
        item.id === lead.id
          ? {
              ...item,
              stage: stageForApi(nextStage),
              uiStage: nextStage,
            }
          : item
      )
    )

    try {
      await EventOps.updateLead(lead.id, {
        stage: stageForApi(nextStage),
      })

      toast.success('Lead moved', {
        description: `${lead.name} moved to ${nextStage}.`,
      })
    } catch (error) {
      setLeads(previousLeads)

      toast.error('Could not move lead', {
        description: error?.message || 'Lead stage could not be updated.',
      })
    }
  }

  const add = async () => {
    if (!form.name.trim()) {
      toast.error('Name required')
      return
    }

    try {
      setSaving(true)

      await EventOps.createLead({
        title: form.name,
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        source: form.category,
        category: form.category,
        stage: 'new',
        notes: form.note,
        note: form.note,
        value: Number(form.value || 0),
      })

      setOpen(false)
      setForm({
        name: '',
        email: '',
        phone: '',
        category: 'Hot Lead',
        value: '',
        note: '',
      })

      await load()

      toast.success('Lead added')
    } catch (error) {
      toast.error('Lead not added', {
        description: error?.message || 'Unable to add lead.',
      })
    } finally {
      setSaving(false)
    }
  }

  if (!leads) return <Loading label="Loading leads…" />

  return (
    <div>
      <PageHeader
        title="Smart Lead Capture"
        subtitle={`CRM pipeline • $${pipelineValue.toLocaleString()} open pipeline value`}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="mr-1.5 h-4 w-4" /> Add lead
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add lead</DialogTitle>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="e.g. Auckland Events Group"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="021..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm({ ...form, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Value ($)</Label>
                  <Input
                    type="number"
                    value={form.value}
                    onChange={(event) => setForm({ ...form, value: event.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Note</Label>
                <Textarea
                  rows={2}
                  value={form.note}
                  onChange={(event) => setForm({ ...form, note: event.target.value })}
                  placeholder="Lead notes"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={add} disabled={saving} className="bg-cyan-500 hover:bg-cyan-600">
                {saving ? 'Adding...' : 'Add lead'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {STAGES.map((stage) => {
          const columnLeads = leads.filter((lead) => lead.uiStage === stage)

          return (
            <div
              key={stage}
              className={cn(
                'rounded-2xl border border-t-4 bg-muted/60 p-3',
                STAGE_COLOR[stage]
              )}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {columnLeads.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {columnLeads.map((lead) => (
                  <div key={lead.id} className="rounded-xl border bg-card p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{lead.name}</p>

                      {lead.value > 0 && (
                        <span className="flex items-center text-xs font-medium text-emerald-600">
                          <DollarSign className="h-3 w-3" />
                          {lead.value.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5">
                      <CategoryBadge category={lead.category} />
                    </div>

                    {lead.eventName && (
                      <p className="mt-1.5 truncate text-xs text-muted-foreground">
                        {lead.eventName}
                      </p>
                    )}

                    {lead.email && (
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </p>
                    )}

                    {lead.phone && (
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </p>
                    )}

                    {lead.notes && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {lead.notes}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <button
                        onClick={() => move(lead, -1)}
                        disabled={stage === 'New'}
                        className="rounded p-1 text-slate-400 hover:bg-muted disabled:opacity-30"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />

                      <button
                        onClick={() => move(lead, 1)}
                        disabled={stage === 'Closed'}
                        className="rounded p-1 text-slate-400 hover:bg-muted disabled:opacity-30"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {columnLeads.length === 0 && (
                  <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                    No leads
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}