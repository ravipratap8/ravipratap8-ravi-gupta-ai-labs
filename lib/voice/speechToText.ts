// Ravi AI Voice Copilot — Speech-to-text wrapper around the browser Web Speech API.
// Click-to-speak only. Returns a controller; does nothing on the server.
//
// NOTE: The Web Speech API is experimental and not in the standard TS DOM lib,
// so a few narrow casts are unavoidable here. They are isolated to this file.

interface MinimalRecognition {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

interface SpeechResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

type RecognitionCtor = new () => MinimalRecognition

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor
    webkitSpeechRecognition?: RecognitionCtor
  }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null
}

export interface SpeechRecognizerHandlers {
  onResult: (transcript: string) => void
  onError: (error: string) => void
  onEnd: () => void
}

export interface SpeechRecognizer {
  start: () => void
  stop: () => void
  supported: boolean
}

export function createSpeechRecognizer(
  lang: string,
  handlers: SpeechRecognizerHandlers,
): SpeechRecognizer {
  const Ctor = getRecognitionCtor()
  if (!Ctor) {
    return { start: () => handlers.onError('unsupported'), stop: () => {}, supported: false }
  }
  const recognition = new Ctor()
  recognition.lang = lang
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event: SpeechResultEvent) => {
    const first = event.results[0]
    const alt = first && first[0]
    handlers.onResult(alt ? alt.transcript : '')
  }
  recognition.onerror = (event: { error: string }) => handlers.onError(event.error || 'error')
  recognition.onend = () => handlers.onEnd()

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    supported: true,
  }
}
