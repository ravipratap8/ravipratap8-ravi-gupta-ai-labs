// Ravi AI Voice Copilot — Text-to-speech wrapper around window.speechSynthesis.
// Safe no-op on the server or where unsupported.

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, lang = 'en-NZ'): void {
  if (!isSpeechSynthesisSupported() || !text) return
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 1
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  } catch {
    // Ignore — TTS is a non-critical enhancement.
  }
}

export function cancelSpeech(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
