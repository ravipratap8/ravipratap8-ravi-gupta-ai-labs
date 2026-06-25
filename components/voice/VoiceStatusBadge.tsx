'use client'

import { Loader2, Mic, CheckCircle2, AlertTriangle, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VoiceStatus } from '@/lib/voice/types'

const MAP: Record<VoiceStatus, { label: string; className: string; Icon: typeof Mic; spin?: boolean; pulse?: boolean }> = {
  idle: { label: 'Ready', className: 'bg-muted text-muted-foreground', Icon: Mic },
  listening: { label: 'Listening…', className: 'bg-rose-100 text-rose-700', Icon: Radio, pulse: true },
  processing: { label: 'Thinking…', className: 'bg-amber-100 text-amber-700', Icon: Loader2, spin: true },
  done: { label: 'Done', className: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle2 },
  error: { label: 'Issue', className: 'bg-rose-100 text-rose-700', Icon: AlertTriangle },
}

export default function VoiceStatusBadge({ status }: { status: VoiceStatus }) {
  const { label, className, Icon, spin, pulse } = MAP[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', className)}>
      <Icon className={cn('h-3.5 w-3.5', spin && 'animate-spin', pulse && 'animate-pulse')} />
      {label}
    </span>
  )
}
