'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { consumeVoiceAction } from '@/lib/voice/voiceActions'
import { PageHeader, Loading, EmptyState } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Sparkles, Copy, Save, Loader2, Facebook, Instagram, Video, Mail, FileQuestion, Linkedin, Trash2, Wand2 } from 'lucide-react'

const TYPES = [
  { label: 'Facebook post', icon: Facebook },
  { label: 'Instagram caption', icon: Instagram },
  { label: '45-second reel script', icon: Video },
  { label: 'Email announcement', icon: Mail },
  { label: 'FAQ page', icon: FileQuestion },
  { label: 'LinkedIn post', icon: Linkedin },
]

export default function AiContentPage() {
  const [events, setEvents] = useState([])
  const [eventId, setEventId] = useState('')
  const [type, setType] = useState('Instagram caption')
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState([])

  const loadSaved = () => EventOps.contentList().then(setSaved).catch(() => {})
  useEffect(() => {
    EventOps.events().then((e) => { setEvents(e); if (e[0]) setEventId(e[0].id) }).catch(() => {})
    loadSaved()
  }, [])

  // Voice Copilot: auto-select content type and generate when arriving via a voice command.
  const [pendingType, setPendingType] = useState(null)
  useEffect(() => {
    const a = consumeVoiceAction()
    if (a && a.actionType === 'generate_content' && a.payload?.contentType) {
      setType(a.payload.contentType)
      setPendingType(a.payload.contentType)
    }
  }, [])
  useEffect(() => {
    if (pendingType && eventId) { generate(); setPendingType(null) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingType, eventId])

  const generate = async () => {
    if (!eventId) { toast.error('Select an event first'); return }
    setLoading(true)
    try {
      const res = await EventOps.generateContent({ eventId, type, prompt })
      setOutput(res.content)
    } catch { toast.error('Generation failed') } finally { setLoading(false) }
  }
  const copy = () => { navigator.clipboard?.writeText(output); toast.success('Copied to clipboard') }
  const save = async () => {
    const ev = events.find((e) => e.id === eventId)
    await EventOps.saveContent({ eventId, eventName: ev?.name, type, prompt, content: output })
    toast.success('Saved to library')
    loadSaved()
  }
  const remove = async (id) => { await EventOps.deleteContent(id); loadSaved() }

  return (
    <div>
      <PageHeader title="AI Content Generator" subtitle="Generate on-brand marketing content per event. Placeholder engine — OpenAI / Vercel AI SDK wires in later." />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* Controls */}
        <div className="space-y-4 rounded-2xl border bg-card p-6">
          <div className="space-y-1.5"><label className="text-sm font-medium">Event</label>
            <Select value={eventId} onValueChange={setEventId}><SelectTrigger><SelectValue placeholder="Choose event" /></SelectTrigger>
              <SelectContent>{events.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Content type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button key={t.label} onClick={() => setType(t.label)} className={cn('flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition', type === t.label ? 'border-cyan-400 bg-cyan-50 text-cyan-800' : 'hover:bg-slate-50')}>
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Prompt / tone (optional)</label>
            <Textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. High energy, include emojis and a strong ticket CTA" />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:opacity-90">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Generate content
          </Button>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-cyan-500" /><h2 className="font-display font-semibold">Generated preview</h2></div>
            {output && <Badge variant="outline">{type}</Badge>}
          </div>
          {output ? (
            <>
              <pre className="whitespace-pre-wrap rounded-xl bg-muted p-4 font-sans text-sm leading-relaxed text-foreground">{output}</pre>
              <div className="mt-4 flex gap-2"><Button variant="outline" onClick={copy}><Copy className="mr-1.5 h-4 w-4" /> Copy</Button><Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700"><Save className="mr-1.5 h-4 w-4" /> Save to library</Button></div>
            </>
          ) : (
            <div className="grid place-items-center rounded-xl border border-dashed py-16 text-center text-muted-foreground">
              <Sparkles className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-sm">Pick an event and content type, then generate.</p>
            </div>
          )}
        </div>
      </div>

      {/* Library */}
      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold">Content library ({saved.length})</h2>
        {saved.length === 0 ? <EmptyState icon={Sparkles} title="No saved content yet" desc="Generate and save content to build your library." /> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((c) => (
              <div key={c.id} className="flex flex-col rounded-2xl border bg-card p-4">
                <div className="mb-2 flex items-center justify-between"><Badge variant="outline" className="bg-cyan-50 text-cyan-700">{c.type}</Badge><button onClick={() => remove(c.id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button></div>
                <p className="text-xs font-medium text-muted-foreground">{c.eventName}</p>
                <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-foreground/90">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
