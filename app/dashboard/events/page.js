'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EventOps } from '@/lib/api-client'
import { PageHeader, StatusBadge, Loading, EmptyState } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

    EventOps.events(qs)
      .then(setEvents)
      .catch(() => setEvents([]))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status])

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        title="Events"
        subtitle="Manage your event portfolio and their AI knowledge base."
      >
        <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 sm:w-auto">
          <Link href="/dashboard/events/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New event
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search events, venue or city..."
            className="h-11 pl-9"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!events ? (
        <Loading label="Loading events..." />
      ) : events.length === 0 ? (
        <div className="pb-20 sm:pb-0">
          <EmptyState
            icon={CalendarX2}
            title="No events found"
            desc="Try a different search, or create your first event."
          >
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
              <Link href="/dashboard/events/new">
                <Plus className="mr-1.5 h-4 w-4" />
                New event
              </Link>
            </Button>
          </EmptyState>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/dashboard/events/${event.id}`}
              className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-40 overflow-hidden bg-muted">
                {event.flyerImage ? (
                  <img
                    src={event.flyerImage}
                    alt={event.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-slate-300">
                    <CalendarDays className="h-10 w-10" />
                  </div>
                )}

                <div className="absolute right-3 top-3">
                  <StatusBadge status={event.status} />
                </div>
              </div>

              <div className="p-5">
                <h3 className="line-clamp-1 font-display text-lg font-semibold text-foreground">
                  {event.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-cyan-500" />
                    <span className="truncate">{event.date || 'Date TBC'}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-cyan-500" />
                    <span className="truncate">
                      {event.venue || 'Venue TBC'}
                      {event.city ? `, ${event.city}` : ''}
                    </span>
                  </p>

                  {event.ticketLink ? (
                    <p className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 shrink-0 text-cyan-500" />
                      <span>Tickets available</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}