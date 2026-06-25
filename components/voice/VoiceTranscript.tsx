'use client'

import { Quote } from 'lucide-react'
import type { VoiceStatus } from '@/lib/voice/types'

interface Props {
  transcript: string
  status: VoiceStatus
}

export default function VoiceTranscript({ transcript, status }: Props) {
  return (
    <div className="rounded-xl border bg-muted p-3">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">You said</p>
      {transcript ? (
        <p className="flex items-start gap-1.5 text-sm text-foreground">
          <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
          {transcript}
        </p>
      ) : (
        <p className="text-sm italic text-muted-foreground">
          {status === 'listening' ? 'Listening… speak your command.' : 'Tap the mic or type a command below.'}
        </p>
      )}
    </div>
  )
}
