'use client'

import { Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  listening: boolean
  onClick: () => void
}

export default function VoiceButton({ listening, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Ravi AI Voice Copilot"
      className={cn(
        'relative grid h-14 w-14 place-items-center rounded-full text-slate-950 shadow-xl transition active:scale-95',
        'bg-gradient-to-br from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400',
      )}
    >
      {listening && <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/60" />}
      <Mic className="relative h-6 w-6" />
    </button>
  )
}
