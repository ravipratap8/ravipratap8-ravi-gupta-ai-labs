'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EventOps } from '@/lib/api-client'
import { PageHeader } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, ImageIcon } from 'lucide-react'

const FIELD = 'space-y-1.5'

export default function NewEventPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', date: '', venue: '', city: '', status: 'Draft', ticketLink: '',
    organiserName: 'Ravi Events Co.', organiserEmail: 'events@ravigupta.dev',
    artistDetails: '', flyerImage: '', refundPolicy: '', parkingInfo: '', meetGreet: '',
  })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name) { toast.error('Event name is required'); return }
    setSaving(true)
    try {
      const created = await EventOps.createEvent(form)
      toast.success('Event created', { description: form.name })
      router.push(`/dashboard/events/${created.id}`)
    } catch (err) {
      toast.error('Could not create event')
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/events" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to events</Link>
      <PageHeader title="Create event" subtitle="Add an event and its AI knowledge base (policies, logistics, FAQ)." />

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-display font-semibold">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${FIELD} sm:col-span-2`}><Label>Event name *</Label><Input value={form.name} onChange={set('name')} placeholder="e.g. Bollywood Nights Auckland 2025" /></div>
            <div className={FIELD}><Label>Date</Label><Input type="date" value={form.date} onChange={set('date')} /></div>
            <div className={FIELD}><Label>Status</Label>
              <Select value={form.status} onValueChange={set('status')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Published">Published</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent>
              </Select>
            </div>
            <div className={FIELD}><Label>Venue</Label><Input value={form.venue} onChange={set('venue')} placeholder="The Civic" /></div>
            <div className={FIELD}><Label>City</Label><Input value={form.city} onChange={set('city')} placeholder="Auckland" /></div>
            <div className={FIELD}><Label>Ticket link</Label><Input value={form.ticketLink} onChange={set('ticketLink')} placeholder="https://…" /></div>
            <div className={FIELD}><Label className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Flyer image URL</Label><Input value={form.flyerImage} onChange={set('flyerImage')} placeholder="https://… (placeholder)" /></div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-display font-semibold">Organiser & line-up</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={FIELD}><Label>Organiser name</Label><Input value={form.organiserName} onChange={set('organiserName')} /></div>
            <div className={FIELD}><Label>Organiser email</Label><Input type="email" value={form.organiserEmail} onChange={set('organiserEmail')} /></div>
            <div className={`${FIELD} sm:col-span-2`}><Label>Artist / guest details</Label><Textarea rows={2} value={form.artistDetails} onChange={set('artistDetails')} /></div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="mb-1 font-display font-semibold">AI knowledge base</h2>
          <p className="mb-4 text-sm text-muted-foreground">The AI assistant uses these to ground customer replies.</p>
          <div className="grid gap-4">
            <div className={FIELD}><Label>Refund policy</Label><Textarea rows={2} value={form.refundPolicy} onChange={set('refundPolicy')} /></div>
            <div className={FIELD}><Label>Parking information</Label><Textarea rows={2} value={form.parkingInfo} onChange={set('parkingInfo')} /></div>
            <div className={FIELD}><Label>Meet & greet details</Label><Textarea rows={2} value={form.meetGreet} onChange={set('meetGreet')} /></div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/events"><Button type="button" variant="outline">Cancel</Button></Link>
          <Button type="submit" disabled={saving} className="bg-cyan-500 hover:bg-cyan-600">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Create event</Button>
        </div>
      </form>
    </div>
  )
}
