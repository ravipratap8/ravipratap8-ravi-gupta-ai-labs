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
  Mic,
  Send,
  X,
  Volume2,
  VolumeX,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Check,
  ChevronRight,
  AlertTriangle,
  Cpu,
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
    <div className="flex max-h-[min(72dvh,560px)] w-full max-w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[360px] sm:max-w-[calc(100vw-2rem)]">
      <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-400/20 text-cyan-300">
            <Sparkles className="h-4 w-4" />
          </span>

          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">Ravi AI Voice Copilot</p>
            <p className="truncate text-[10px] text-slate-300">
              Click-to-speak • human-in-the-loop
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={props.onClose}
          aria-label="Close voice copilot"
          className="ml-3 grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 scrollbar-thin sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <VoiceStatusBadge status={props.status} />

          <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            {props.speakReplies ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            <span className="hidden xs:inline">Voice replies</span>
            <Switch checked={props.speakReplies} onCheckedChange={props.onToggleSpeak} />
          </label>
        </div>

        <VoiceTranscript transcript={props.transcript} status={props.status} />

        {props.result && (
          <div
            className={cn(
              'rounded-xl border p-3',
              props.result.success
                ? 'border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-50'
                : 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-50'
            )}
          >
            {props.result.success ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold text-cyan-800 dark:text-cyan-200">
                    {props.result.label}
                  </span>

                  <span className="shrink-0 text-[11px] font-medium text-cyan-900/70 dark:text-cyan-100/70">
                    {confidencePct}% • {props.result.category}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-relaxed">{props.result.response}</p>

                {props.result.mcpTool && (
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] text-violet-600 dark:text-violet-300">
                    <Cpu className="h-3 w-3" />
                    Future MCP tool: <code>{props.result.mcpTool}</code>
                  </p>
                )}
              </>
            ) : (
              <p className="flex items-start gap-1.5 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {props.result.response}
              </p>
            )}
          </div>
        )}

        {props.pendingConfirm && props.result && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-50">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Confirmation required
            </p>

            <p className="mt-1 text-sm leading-relaxed">
              This is a human-in-the-loop action. Confirm to continue to approvals.
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={props.onConfirm}
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Confirm
              </Button>

              <Button size="sm" variant="outline" onClick={props.onCancelConfirm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {props.lastAction ? (
          <p className="text-[11px] text-muted-foreground">
            Last action:{' '}
            <span className="font-medium text-foreground/90">{props.lastAction}</span>
          </p>
        ) : null}

        {props.error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
            {props.error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => setShowHelp((value) => !value)}
          className="flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            What can I say?
          </span>

          <ChevronRight
            className={cn('h-3.5 w-3.5 transition', showHelp && 'rotate-90')}
          />
        </button>

        {showHelp && (
          <div className="max-h-36 space-y-1 overflow-y-auto rounded-lg border bg-muted p-2 scrollbar-thin">
            {props.helpCommands.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 rounded px-1.5 py-1 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-2"
              >
                <span className="text-foreground/90">{item.label}</span>
                <code className="text-[10px] text-slate-400">“{item.example}”</code>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-1.5 rounded-lg bg-muted p-2 text-[10px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
          Voice safety: click-to-speak only, no always-on listening, no automatic customer
          messaging, and human approval stays mandatory.
        </div>
      </div>

      <div className="shrink-0 border-t bg-card/95 p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            onClick={props.onStartListening}
            disabled={!props.sttSupported}
            title={
              props.sttSupported
                ? 'Start listening'
                : 'Speech recognition not supported — type instead'
            }
            className="h-10 w-10 shrink-0 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40"
          >
            <Mic className="h-4 w-4" />
          </Button>

          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && submit()}
            placeholder={
              props.sttSupported
                ? 'Type a command...'
                : 'Type command, e.g. open approvals'
            }
            className="h-10 min-w-0"
          />

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={submit}
            className="h-10 w-10 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {!props.sttSupported ? (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Speech recognition is unavailable in this browser. The text command box works as a fallback.
          </p>
        ) : null}
      </div>
    </div>
  )
}