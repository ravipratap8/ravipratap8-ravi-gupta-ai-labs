'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import VoiceButton from './VoiceButton'
import VoiceCommandPanel from './VoiceCommandPanel'
import { voiceConfig } from '@/lib/voice/voiceConfig'
import { routeCommand, getHelpCommands } from '@/lib/voice/intentRouter'
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  type SpeechRecognizer,
} from '@/lib/voice/speechToText'
import { speak, cancelSpeech } from '@/lib/voice/textToSpeech'
import { queueVoiceAction } from '@/lib/voice/voiceActions'
import type { VoiceCommandResult, VoiceStatus } from '@/lib/voice/types'

export default function VoiceCopilot() {
  const pathname = usePathname()
  const router = useRouter()
  const recognizerRef = useRef<SpeechRecognizer | null>(null)

  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<VoiceStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState<VoiceCommandResult | null>(null)
  const [lastAction, setLastAction] = useState('')
  const [error, setError] = useState('')
  const [speakReplies, setSpeakReplies] = useState<boolean>(
    voiceConfig.defaultSpeakReplies
  )
  const [pendingConfirm, setPendingConfirm] = useState(false)
  const [sttSupported, setSttSupported] = useState(false)

  useEffect(() => {
    setSttSupported(isSpeechRecognitionSupported())
  }, [])

  const maybeSpeak = useCallback(
    (text: string) => {
      if (speakReplies) speak(text, voiceConfig.lang)
    },
    [speakReplies]
  )

  const execute = useCallback(
    (data: VoiceCommandResult) => {
      setPendingConfirm(false)
      maybeSpeak(data.response)

      switch (data.actionType) {
        case 'navigate':
          if (data.target) router.push(data.target)
          setLastAction(`Navigated to ${data.target ?? ''}`)
          break

        case 'generate_content':
          queueVoiceAction({
            actionType: data.actionType,
            intent: data.intent,
            payload: data.payload,
          })
          router.push(data.target ?? '/dashboard/ai-content')
          setLastAction(`Generating ${data.payload?.contentType ?? 'content'}`)
          break

        case 'enquiry':
          queueVoiceAction({
            actionType: data.actionType,
            intent: data.intent,
            payload: data.payload,
          })
          router.push(data.target ?? '/dashboard/inbox')
          setLastAction('Opened enquiry composer')
          break

        case 'approval':
          queueVoiceAction({
            actionType: data.actionType,
            intent: data.intent,
            payload: data.payload,
          })
          router.push(data.target ?? '/dashboard/approvals')
          setLastAction(
            `${data.payload?.decision === 'reject' ? 'Rejecting' : 'Approving'} top reply`
          )
          break

        case 'help':
          setLastAction('Showed available commands')
          break

        default:
          setLastAction('')
      }

      setStatus('done')
    },
    [router, maybeSpeak]
  )

  const process = useCallback(
    async (text: string) => {
      setStatus('processing')
      setError('')

      let data: VoiceCommandResult

      try {
        const res = await fetch('/api/voice/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: text }),
        })

        data = (await res.json()) as VoiceCommandResult
      } catch {
        data = routeCommand(text)
      }

      setResult(data)

      if (data.success && data.requiresConfirmation) {
        setPendingConfirm(true)
        setStatus('done')
        maybeSpeak(data.response)
        return
      }

      execute(data)
    },
    [execute, maybeSpeak]
  )

  const startListening = useCallback(() => {
    setError('')
    setTranscript('')
    setResult(null)
    setPendingConfirm(false)

    if (!sttSupported) {
      setOpen(true)
      setError('Speech recognition is not supported here. Type your command instead.')
      return
    }

    setOpen(true)
    setStatus('listening')

    recognizerRef.current = createSpeechRecognizer(voiceConfig.lang, {
      onResult: (t: string) => {
        setTranscript(t)
        void process(t)
      },
      onError: (e: string) => {
        setStatus('error')
        setError(
          e === 'not-allowed'
            ? 'Microphone permission denied.'
            : `Could not capture audio (${e}). Type instead.`
        )
      },
      onEnd: () => {
        setStatus((s) => (s === 'listening' ? 'idle' : s))
      },
    })

    recognizerRef.current.start()
  }, [sttSupported, process])

  const submitText = useCallback(
    (text: string) => {
      setTranscript(text)
      void process(text)
    },
    [process]
  )

  const onConfirm = useCallback(() => {
    if (result) execute(result)
  }, [result, execute])

  const onToggleSpeak = useCallback((v: boolean) => {
    setSpeakReplies(v)
    if (!v) cancelSpeech()
  }, [])

  const openCopilot = useCallback(() => {
    setOpen(true)

    if (sttSupported) {
      startListening()
    }
  }, [sttSupported, startListening])

  if (!voiceConfig.enabled || !pathname?.startsWith('/dashboard')) return null

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 right-4 z-[60] flex flex-col items-end gap-3 sm:left-auto sm:right-6 sm:bottom-6">
      <div className="w-full sm:w-auto">
        <VoiceCommandPanel
          open={open}
          status={status}
          transcript={transcript}
          result={result}
          lastAction={lastAction}
          error={error}
          sttSupported={sttSupported}
          speakReplies={speakReplies}
          pendingConfirm={pendingConfirm}
          helpCommands={getHelpCommands()}
          onClose={() => setOpen(false)}
          onStartListening={startListening}
          onSubmitText={submitText}
          onToggleSpeak={onToggleSpeak}
          onConfirm={onConfirm}
          onCancelConfirm={() => setPendingConfirm(false)}
        />
      </div>

      <VoiceButton listening={status === 'listening'} onClick={open ? () => setOpen(false) : openCopilot} />
    </div>
  )
}