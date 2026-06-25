// WhatsApp webhook verification (PLACEHOLDER).
// Meta sends hub.mode, hub.verify_token and hub.challenge on GET.
export function verifyWebhook(searchParams) {
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  if (token && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'demo-verify-token')) {
    return { ok: true, challenge }
  }
  return { ok: false }
}
