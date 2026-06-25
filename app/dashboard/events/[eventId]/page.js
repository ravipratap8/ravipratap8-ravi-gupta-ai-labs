'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { EventOps } from '@/lib/api-client'
import { PageHeader, StatusBadge, Loading, StatusBadge as SB } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from 'sonner'
import { ArrowLeft, CalendarDays, MapPin, Ticket, Mail, User, Car, Undo2, Star, MessagesSquare, ExternalLink } from 'lucide-react'

function Info({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-600"><Icon className="h-4 w-4" /></span>
      <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-0.5 text-sm text-foreground">{value}</p></div>
    </div>
  )
}

export default function EventDetailPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)

  const load = () => EventOps.event(eventId).then(setEvent).catch(() => setEvent(false))
  useEffect(() => { load() }, [eventId])

  const updateStatus = async (status) => {
    await EventOps.updateEvent(eventId, { status })
    setEvent((e) => ({ ...e, status }))
    toast.success(`Status set to ${status}`)
  }

  if (event === null) return <Loading label="Loading event…" />
  if (event === false) return <div className="py-20 text-center text-muted-foreground">Event not found. <Link href="/dashboard/events" className="text-cyan-600 underline">Back to events</Link></div>

  return (
    <div>
      <Link href="/dashboard/events" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to events</Link>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="relative h-48 bg-muted md:h-60">
          {event.flyerImage && <img src={event.flyerImage} alt={event.name} className="h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <Badge className="mb-2 border-0 bg-white/90 text-foreground">{event.city || 'Event'}</Badge>
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">{event.name}</h1>
            </div>
            <StatusBadge status={event.status} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4 px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Select value={event.status} onValueChange={updateStatus}>
              <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Published">Published</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent>
            </Select>
          </div>
          {event.ticketLink && <a href={event.ticketLink} target="_blank" rel="noreferrer"><Button variant="outline" size="sm"><Ticket className="mr-1.5 h-4 w-4" /> Ticket page <ExternalLink className="ml-1.5 h-3 w-3" /></Button></a>}
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="faq">FAQ ({event.faq?.length || 0})</TabsTrigger>
              <TabsTrigger value="messages">Enquiries ({event.messages?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Info icon={CalendarDays} label="Date" value={event.date} />
                <Info icon={MapPin} label="Venue" value={`${event.venue}${event.city ? `, ${event.city}` : ''}`} />
                <Info icon={User} label="Organiser" value={event.organiserName} />
                <Info icon={Mail} label="Organiser email" value={event.organiserEmail} />
                <Info icon={Star} label="Artist / guests" value={event.artistDetails} />
                <Info icon={Car} label="Parking" value={event.parkingInfo} />
                <Info icon={Undo2} label="Refund policy" value={event.refundPolicy} />
                <Info icon={Star} label="Meet & greet" value={event.meetGreet} />
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-5">
              {event.faq?.length ? (
                <Accordion type="single" collapsible className="rounded-xl border bg-card px-4">
                  {event.faq.map((f, i) => (
                    <AccordionItem key={i} value={`f${i}`}><AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger><AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent></AccordionItem>
                  ))}
                </Accordion>
              ) : <p className="text-sm text-muted-foreground">No FAQ added yet.</p>}
            </TabsContent>

            <TabsContent value="messages" className="mt-5">
              {event.messages?.length ? (
                <div className="space-y-3">
                  {event.messages.map((m) => (
                    <div key={m.id} className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between"><p className="text-sm font-semibold text-foreground">{m.customerName}</p><SB status={m.status} /></div>
                      <p className="mt-1 text-sm text-foreground/90">{m.message}</p>
                      <p className="mt-2 rounded-lg bg-cyan-50 p-2 text-sm text-cyan-900"><MessagesSquare className="mr-1 inline h-3.5 w-3.5" /> {m.aiSuggestedReply}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No enquiries for this event yet.</p>}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
