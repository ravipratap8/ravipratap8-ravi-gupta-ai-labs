// Prompt templates used by the AI layer. These are the real prompts a future
// OpenAI / Vercel AI SDK integration would send (kept here so they are testable).

export const SYSTEM_REPLY_PROMPT = `You are the customer support assistant for an event organiser.
Rules:
- Answer ONLY using the provided event context (FAQ, refund policy, parking, meet & greet).
- If you are unsure, say you will check and hand off to a human.
- Never promise refunds; route refund requests to a human.
- Be warm, concise and on-brand. Output a confidence score 0-1.`

export const CLASSIFY_PROMPT = `Classify the customer message into exactly one category:
Hot Lead, General Enquiry, Complaint, Refund Request, Sponsorship Enquiry, Vendor Enquiry, Group Booking.
Return category, riskLevel (Low|Medium|High) and confidence (0-1).`

export const CONTENT_PROMPT = (type) => `Generate a ${type} for the given event.
Use the event details (name, date, venue, line-up, ticket link). Match the requested tone.`
