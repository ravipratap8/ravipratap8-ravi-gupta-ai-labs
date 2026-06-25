// Supabase Edge Function placeholder for the WhatsApp webhook.
// Deploy with: supabase functions deploy whatsapp-webhook
export default async function handler(req) {
  return new Response(JSON.stringify({ ok: true, placeholder: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
