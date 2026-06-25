'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import VoiceStatusBadge from './VoiceStatusBadge'
import VoiceTranscript from './VoiceTranscript'
import type { VoiceCommandResult, VoiceStatus } from '@/lib/voice/types'
import type { HelpEntry } from '@/lib/voice/intentRouter'
import {
  Mic, Send, X, Volume2, VolumeX, ShieldCheck, Sparkles, HelpCircle,
  Check, ChevronRight, AlertTriangle, Cpu,
} from 'lucide-react'

interface Props {
  open: boolean
  status: VoiceStatus
  transcript: string
  result: VoiceCommandResult | null
  lastAction: string
  error: string
  sttSupported: boolean
  speakReplies: boolean
  pendingConfirm: boolean
  helpCommands: HelpEntry[]
  onClose: () => void
  onStartListening: () => void
  onSubmitText: (text: string) => void
  onToggleSpeak: (v: boolean) => void
  onConfirm: () => void
  onCancelConfirm: () => void
}

export default function VoiceCommandPanel(props: Props) {
  const [text, setText] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  if (!props.open) return null

  const submit = () => {
    if (!text.trim()) return
    props.onSubmitText(text.trim())
    setText('')
  }

  const confidencePct = props.result ? Math.round(props.result.confidence * 100) : 0

  return (
    <div className="mb-3 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-400/20 text-cyan-300"><Sparkles className="h-4 w-4" /></span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Ravi AI Voice Copilot</p>
            <p className="text-[10px] text-slate-300">Click-to-speak • human-in-the-loop</p>
          </div>
        </div>
        <button onClick={props.onClose} aria-label="Close" className="text-slate-300 hover:text-white"><X className="h-4 w-4" /></button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <VoiceStatusBadge status={props.status} />
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {props.speakReplies ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />} Voice replies
            <Switch checked={props.speakReplies} onCheckedChange={props.onToggleSpeak} />
          </label>
        </div>

        <VoiceTranscript transcript={props.transcript} status={props.status} />

        {/* Result */}
        {props.result && (
          <div className={cn('rounded-xl border p-3', props.result.success ? 'border-cyan-200 bg-cyan-50' : 'border-amber-200 bg-amber-50')}>
            {props.result.success ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-800">{props.result.label}</span>
                  <span className="text-[11px] font-medium text-muted-foreground">{confidencePct}% • {props.result.category}</span>
                </div>
                <p className="mt-1 text-sm text-foreground">{props.result.response}</p>
                {props.result.mcpTool && (
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] text-violet-600"><Cpu className="h-3 w-3" /> Future MCP tool: <code>{props.result.mcpTool}</code></p>
                )}
              </>
            ) : (
              <p className="flex items-start gap-1.5 text-sm text-amber-800"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {props.result.response}</p>
            )}
          </div>
        )}

        {/* Confirmation gate for approval actions */}
        {props.pendingConfirm && props.result && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-800"><ShieldCheck className="h-4 w-4" /> Confirmation required</p>
            <p className="mt-1 text-sm text-rose-900">This is a human-in-the-loop action. Confirm to continue to approvals.</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={props.onConfirm}><Check className="mr-1 h-3.5 w-3.5" /> Confirm</Button>
              <Button size="sm" variant="outline" onClick={props.onCancelConfirm}>Cancel</Button>
            </div>
          </div>
        )}

        {props.lastAction && <p className="text-[11px] text-muted-foreground">Last action: <span className="font-medium text-foreground/90">{props.lastAction}</span></p>}
        {props.error && <p className="text-[11px] text-rose-600">{props.error}</p>}

        {/* Mic + text input */}
        <div className="flex items-center gap-2">
          <Button type="button" size="icon" onClick={props.onStartListening} disabled={!props.sttSupported} title={props.sttSupported ? 'Start listening' : 'Speech recognition not supported — type instead'} className="shrink-0 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40">
            <Mic className="h-4 w-4" />
          </Button>
          <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder={props.sttSupported ? 'or type a command…' : 'Type a command (e.g. open approvals)'} className="h-9" />
          <Button type="button" size="icon" variant="outline" onClick={submit} className="shrink-0"><Send className="h-4 w-4" /></Button>
        </div>
        {!props.sttSupported && <p className="text-[11px] text-muted-foreground">Speech recognition is unavailable in this browser — the text command box works as a fallback.</p>}

        {/* Help */}
        <button onClick={() => setShowHelp((v) => !v)} className="flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <span className="flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5" /> What can I say?</span>
          <ChevronRight className={cn('h-3.5 w-3.5 transition', showHelp && 'rotate-90')} />
        </button>
        {showHelp && (
          <div className="max-h-40 space-y-1 overflow-y-auto scrollbar-thin rounded-lg border bg-muted p-2">
            {props.helpCommands.map((h) => (
              <div key={h.label} className="flex items-center justify-between gap-2 rounded px-1.5 py-1 text-xs">
                <span className="text-foreground/90">{h.label}</span>
                <code className="text-[10px] text-slate-400">“{h.example}”</code>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-1.5 rounded-lg bg-muted p-2 text-[10px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
          Voice safety: click-to-speak only, no always-on listening, no automatic customer messaging, and human approval stays mandatory.
        </div>
      </div>
    </div>
  )
}
