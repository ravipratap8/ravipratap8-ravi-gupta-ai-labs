// Mock AI engine for AI EventOps Assistant.
//
// IMPORTANT: This is a deterministic, rule-based placeholder that mimics an LLM.
// It produces realistic classifications, replies and content WITHOUT any API key.
//
// === FUTURE INTEGRATION ===
// Replace the bodies of these functions with calls to the Vercel AI SDK / OpenAI:
//   import { generateText } from 'ai'
//   import { openai } from '@ai-sdk/openai'
// The function signatures and return shapes are designed to stay the same so
// the rest of the app (UI + API routes) does not need to change.

const CATEGORY_RULES = [
  { match: ['refund', 'money back', 'cancel my ticket'], category: 'Refund Request', riskLevel: 'High', confidence: 0.9 },
  { match: ['complaint', 'disappointed', 'terrible', 'worst', 'angry', 'no one replied', 'unacceptable'], category: 'Complaint', riskLevel: 'High', confidence: 0.74 },
  { match: ['sponsor', 'sponsorship', 'partner', 'partnership', 'brand'], category: 'Sponsorship Enquiry', riskLevel: 'Medium', confidence: 0.82 },
  { match: ['vendor', 'stall', 'sell food', 'booth', 'pop up'], category: 'Vendor Enquiry', riskLevel: 'Low', confidence: 0.85 },
  { match: ['group', 'bulk', 'discount for', 'corporate table', 'block of'], category: 'Group Booking', riskLevel: 'Low', confidence: 0.84 },
  { match: ['buy', 'book', 'how much', 'price', 'interested in tickets', 'still available', 'vip'], category: 'Hot Lead', riskLevel: 'Medium', confidence: 0.8 },
]

export function classifyMessage(text = '') {
  const t = String(text).toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.match.some((k) => t.includes(k))) {
      return {
        category: rule.category,
        riskLevel: rule.riskLevel,
        confidence: rule.confidence,
        tags: deriveTags(t),
        model: 'eventops-classifier-mock-v1',
      }
    }
  }
  return {
    category: 'General Enquiry',
    riskLevel: 'Low',
    confidence: 0.81,
    tags: deriveTags(t),
    model: 'eventops-classifier-mock-v1',
  }
}

function deriveTags(t) {
  const tags = []
  if (t.includes('parking')) tags.push('parking')
  if (t.includes('refund')) tags.push('refund')
  if (t.includes('ticket')) tags.push('ticketing')
  if (t.includes('meet') && t.includes('greet')) tags.push('meet-greet')
  if (t.includes('group')) tags.push('group')
  if (t.includes('sponsor')) tags.push('sponsorship')
  if (t.includes('vendor') || t.includes('stall')) tags.push('vendor')
  return tags
}

export function generateReply(message = '', event = null) {
  const t = String(message).toLowerCase()
  const name = event?.organiserName || 'the team'
  const ev = event?.name || 'the event'
  let reply
  let confidence = 0.82

  if (t.includes('parking')) {
    reply = `Hi! ${event?.parkingInfo || 'Parking details will be shared closer to the event.'} See you at ${ev}! 🎶`
    confidence = 0.93
  } else if (t.includes('refund')) {
    reply = `Thanks for reaching out. Our refund policy for ${ev}: ${event?.refundPolicy || 'please contact us for refund options.'} Let me know if you would like help transferring your ticket instead.`
    confidence = 0.86
  } else if (t.includes('ticket') && (t.includes('where') || t.includes('not receive') || t.includes('didn'))) {
    reply = `Your tickets are emailed instantly after purchase — please check your spam/promotions folder. If you still cannot find them, reply with the email used at checkout and we will resend right away. 🎟️`
    confidence = 0.84
  } else if (t.includes('meet') && t.includes('greet')) {
    reply = `Great question! ${event?.meetGreet || 'Meet & Greet options will be announced soon.'}`
    confidence = 0.9
  } else if (t.includes('group') || t.includes('discount')) {
    reply = `Yes! For groups of 10+ we offer 15% off reserved seating for ${ev}. I can hold your seats and send a group payment link — how many should I reserve?`
    confidence = 0.85
  } else if (t.includes('sponsor')) {
    reply = `Wonderful! We have sponsorship tiers for ${ev} from on-stage branding to sampling booths. I will connect you with our partnerships lead and share the deck. What is the best email to reach you?`
    confidence = 0.78
  } else if (t.includes('vendor') || t.includes('stall')) {
    reply = `Vendor stalls are available for ${ev}. Each includes a 3x3m space and power. I will send our vendor application form and pricing. Do you hold a current food safety certificate?`
    confidence = 0.83
  } else if (t.includes('disappointed') || t.includes('no one replied') || t.includes('complaint')) {
    reply = `I am really sorry for the delay — that is not the experience we want for you. I am escalating this to a human team member now who will personally follow up within the hour. Thank you for your patience. 🙏`
    confidence = 0.7
  } else {
    const faq = event?.faq?.[0]
    reply = faq
      ? `Thanks for your message about ${ev}! ${faq.a} Anything else I can help with?`
      : `Thanks for your message about ${ev}! Let me check the details and get back to you shortly.`
    confidence = 0.79
  }

  const classification = classifyMessage(message)
  return {
    reply,
    confidence,
    category: classification.category,
    riskLevel: classification.riskLevel,
    contextUsed: buildContextUsed(t, event),
    model: 'eventops-reply-mock-v1',
  }
}

function buildContextUsed(t, event) {
  if (!event) return ['No event context available']
  const used = [`Event: ${event.name}`]
  if (t.includes('parking')) used.push('Parking information')
  if (t.includes('refund')) used.push('Refund policy')
  if (t.includes('meet') && t.includes('greet')) used.push('Meet & greet details')
  if (used.length === 1 && event.faq?.length) used.push('Event FAQ')
  return used
}

const CONTENT_TYPES = [
  'Facebook post',
  'Instagram caption',
  '45-second reel script',
  'Email announcement',
  'FAQ page',
  'LinkedIn post',
]

export function getContentTypes() {
  return CONTENT_TYPES
}

export function generateContent(type = 'Instagram caption', event = null, prompt = '') {
  const ev = event?.name || 'Your Event'
  const date = event?.date ? formatDate(event.date) : 'soon'
  const venue = event?.venue || 'the venue'
  const city = event?.city || ''
  const link = event?.ticketLink || 'link in bio'
  const tone = prompt ? `\n\n(Tone guidance applied: "${prompt}")` : ''

  let content
  switch (type) {
    case 'Facebook post':
      content = `🎉 ${ev} is happening on ${date} at ${venue}${city ? `, ${city}` : ''}!\n\n${event?.artistDetails || 'An unforgettable experience awaits.'} Bring your friends and family for a night to remember.\n\n👉 Grab your tickets: ${link}\n\n#${slug(ev)} #${slug(city)}Events`
      break
    case 'Instagram caption':
      content = `✨ ${ev.toUpperCase()} ✨\n${event?.artistDetails || 'Get ready for something special.'} 🪩🎶\n📅 ${date} | 📍 ${venue}\n🎟️ ${link}\nTag who you are bringing 👇 #${slug(ev)} #${slug(city)}`
      break
    case '45-second reel script':
      content = `🎬 45-SECOND REEL SCRIPT — ${ev}\n\n[0:00-0:05] Hook: Fast cut of crowd + lights. Text on screen: "${ev} is coming 👀"\n[0:05-0:15] Show the vibe — ${event?.artistDetails || 'highlights of the line-up'}.\n[0:15-0:30] Key details: ${date} • ${venue}${city ? `, ${city}` : ''}. Add captions for accessibility.\n[0:30-0:40] Social proof / testimonial overlay.\n[0:40-0:45] CTA: "Tickets in bio — don't miss out!" + ${link}\n\nSuggested audio: trending upbeat track. Aspect ratio 9:16.`
      break
    case 'Email announcement':
      content = `Subject: You are invited — ${ev} 🎉\n\nKia ora,\n\nWe are excited to invite you to ${ev} on ${date} at ${venue}${city ? `, ${city}` : ''}.\n\n${event?.artistDetails || 'Expect a fantastic line-up and a great atmosphere.'}\n\nSecure your spot here: ${link}\n\nWarm wishes,\n${event?.organiserName || 'The Events Team'}`
      break
    case 'FAQ page':
      content =
        `# ${ev} — Frequently Asked Questions\n\n` +
        (event?.faq?.length
          ? event.faq.map((f) => `**Q: ${f.q}**\nA: ${f.a}`).join('\n\n')
          : '**Q: When and where is the event?**\nA: Details below.') +
        `\n\n**Q: Is parking available?**\nA: ${event?.parkingInfo || 'Parking info coming soon.'}\n\n**Q: What is the refund policy?**\nA: ${event?.refundPolicy || 'See terms at checkout.'}\n\n**Q: Is there a meet & greet?**\nA: ${event?.meetGreet || 'Details to be announced.'}`
      break
    case 'LinkedIn post':
      content = `Proud to be bringing ${ev} to ${city || 'the community'} on ${date}. 🙌\n\n${event?.artistDetails || 'A carefully curated experience for our community.'}\n\nIf you are interested in sponsorship, partnerships, or a corporate group booking, let's connect.\n\n🎟️ ${link}\n\n#Events #${slug(city)} #Community`
      break
    default:
      content = `${ev} — ${date} at ${venue}. Tickets: ${link}`
  }

  return {
    type,
    content: content + tone,
    model: 'eventops-content-mock-v1',
    tokensEstimated: Math.round(content.length / 4),
  }
}

function slug(s = '') {
  return String(s).replace(/[^a-zA-Z0-9]/g, '')
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return d
  }
}
