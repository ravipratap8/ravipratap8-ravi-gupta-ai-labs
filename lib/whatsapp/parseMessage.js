// Parse an inbound WhatsApp Cloud API payload into a simple message (PLACEHOLDER).
export function parseMessage(payload) {
  try {
    const entry = payload?.entry?.[0]?.changes?.[0]?.value
    const msg = entry?.messages?.[0]
    return {
      from: msg?.from || payload?.from || 'unknown',
      text: msg?.text?.body || payload?.text || '',
      timestamp: msg?.timestamp || Date.now(),
    }
  } catch {
    return { from: 'unknown', text: '', timestamp: Date.now() }
  }
}
