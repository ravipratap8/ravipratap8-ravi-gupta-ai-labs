// Send a WhatsApp message (PLACEHOLDER). Real impl calls the WhatsApp Cloud API
// with WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.
export async function sendMessage({ to, message }) {
  return { success: true, mock: true, to, message, note: 'No real message sent (placeholder).' }
}
