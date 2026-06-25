'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EventOps } from '@/lib/api-client'
import { PageHeader, StatusBadge, Loading, EmptyState } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, MapPin, Plus, Search, Ticket, CalendarX2 } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState(null)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')

  const load = () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (status !== 'all') params.set('status', status)
    const qs = params.toString() ? `?${params.toString()}` : ''
    EventOps.events(qs).then(setEvents).catch(() => setEvents([]))
  }

  useEffect(() => { load() }, [q, status])

  return (
    <div>
      <PageHeader title="Events" subtitle="Manage your event portfolio and their AI knowledge base.">
        <Link href="/dashboard/events/new"><Button className="bg-cyan-500 hover:bg-cyan-600"><Plus className="mr-1.5 h-4 w-4" /> New event</Button></Link>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, venue or city…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!events ? <Loading label="Loading events…" /> : events.length === 0 ? (
        <EmptyState icon={CalendarX2} title="No events found" desc="Try a different search, or create your first event.">
          <Link href="/dashboard/events/new"><Button className="bg-cyan-500 hover:bg-cyan-600"><Plus className="mr-1.5 h-4 w-4" /> New event</Button></Link>
        </EmptyState>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Link key={e.id} href={`/dashboard/events/${e.id}`} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md">
              <div className="relative h-40 overflow-hidden bg-muted">
                {e.flyerImage ? <img src={e.flyerImage} alt={e.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-slate-300"><CalendarDays className="h-10 w-10" /></div>}
                <div className="absolute right-3 top-3"><StatusBadge status={e.status} /></div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">{e.name}</h3>
                <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-cyan-500" /> {e.date || 'Date TBC'}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-500" /> {e.venue}{e.city ? `, ${e.city}` : ''}</p>
                  {e.ticketLink && <p className="flex items-center gap-2"><Ticket className="h-4 w-4 text-cyan-500" /> Tickets available</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
