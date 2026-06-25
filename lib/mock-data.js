// Seed/mock data for AI EventOps Assistant.
// NOTE: This is the placeholder data layer. When Supabase is wired later,
// these structures map 1:1 to the SQL tables in /supabase/seed.sql.

import { v4 as uuid } from 'uuid'

const EVENT_IMAGES = {
  bollywood:
    'https://images.pexels.com/photos/3385614/pexels-photo-3385614.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  punjabi:
    'https://images.unsplash.com/photo-1619229725920-ac8b63b0631a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHw0fHxjb25jZXJ0JTIwZmVzdGl2YWx8ZW58MHx8fHwxNzgyMzcyOTg4fDA&ixlib=rb-4.1.0&q=85',
  live:
    'https://images.pexels.com/photos/4218027/pexels-photo-4218027.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  summit:
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwyfHxjb25mZXJlbmNlJTIwZXZlbnR8ZW58MHx8fHwxNzgyMzcyOTg5fDA&ixlib=rb-4.1.0&q=85',
  mixer:
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHw0fHxjb25mZXJlbmNlJTIwZXZlbnR8ZW58MHx8fHwxNzgyMzcyOTg5fDA&ixlib=rb-4.1.0&q=85',
  holi:
    'https://images.unsplash.com/photo-1582711012124-a56cf82307a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxjb25jZXJ0JTIwZmVzdGl2YWx8ZW58MHx8fHwxNzgyMzcyOTg4fDA&ixlib=rb-4.1.0&q=85',
}

export function buildSeedData() {
  const now = Date.now()
  const iso = (d) => new Date(d).toISOString()

  const events = [
    {
      id: uuid(),
      name: 'Bollywood Nights Auckland 2025',
      date: '2025-09-20',
      venue: 'The Civic',
      city: 'Auckland',
      flyerImage: EVENT_IMAGES.bollywood,
      ticketLink: 'https://tickets.ravigupta.dev/bollywood-nights',
      organiserName: 'Ravi Events Co.',
      organiserEmail: 'events@ravigupta.dev',
      artistDetails: 'Live performances by playback singers + a 6-piece band and DJ Arjun.',
      faq: [
        { q: 'What time do doors open?', a: 'Doors open at 6:30 PM, show starts at 8:00 PM.' },
        { q: 'Is it family friendly?', a: 'Yes, all ages welcome. Under 12s enter free with a paying adult.' },
      ],
      refundPolicy:
        'Full refunds available up to 7 days before the event. Within 7 days, tickets are transferable but non-refundable.',
      parkingInfo: 'Paid parking available at Civic Car Park, 50m from the venue. Limited accessible parking on-site.',
      meetGreet: 'VIP Meet & Greet add-on available for $79 — includes backstage photo and signed poster.',
      status: 'Published',
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 12),
    },
    {
      id: uuid(),
      name: 'Diwali Mela Wellington',
      date: '2025-10-25',
      venue: 'TSB Arena',
      city: 'Wellington',
      flyerImage: EVENT_IMAGES.holi,
      ticketLink: 'https://tickets.ravigupta.dev/diwali-mela',
      organiserName: 'Ravi Events Co.',
      organiserEmail: 'events@ravigupta.dev',
      artistDetails: 'Cultural dance troupes, fireworks finale, and 40+ food and craft stalls.',
      faq: [
        { q: 'Are food stalls included?', a: 'Entry is free for the mela; food and craft purchases are pay-as-you-go.' },
        { q: 'Will there be fireworks?', a: 'Yes — a 15 minute fireworks finale at 9:15 PM.' },
      ],
      refundPolicy: 'General admission is free. Reserved seating refundable up to 48 hours before.',
      parkingInfo: 'Free parking at Queens Wharf after 6 PM. Public transport strongly recommended.',
      meetGreet: 'Community stage photo sessions run hourly — no booking required.',
      status: 'Published',
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 9),
    },
    {
      id: uuid(),
      name: 'Punjabi Live Concert — Christchurch',
      date: '2025-11-08',
      venue: 'Wolfbrook Arena',
      city: 'Christchurch',
      flyerImage: EVENT_IMAGES.punjabi,
      ticketLink: 'https://tickets.ravigupta.dev/punjabi-live',
      organiserName: 'Ravi Events Co.',
      organiserEmail: 'events@ravigupta.dev',
      artistDetails: 'Headline act plus support DJs. Full production with LED stage and pyrotechnics.',
      faq: [
        { q: 'Is there a standing section?', a: 'Yes, the floor is general admission standing. Tiered seating is allocated.' },
      ],
      refundPolicy: 'Strictly no refunds once tickets are issued, except in the event of cancellation.',
      parkingInfo: 'Stadium car park $15 pre-paid, $20 on the day. Gates open 2 hours before show.',
      meetGreet: 'Platinum tickets include a group meet & greet and early venue entry.',
      status: 'Published',
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 6),
    },
    {
      id: uuid(),
      name: 'Tech & Chill Founders Mixer',
      date: '2025-08-29',
      venue: 'GridAKL, Wynyard Quarter',
      city: 'Auckland',
      flyerImage: EVENT_IMAGES.mixer,
      ticketLink: 'https://tickets.ravigupta.dev/founders-mixer',
      organiserName: 'Ravi Gupta',
      organiserEmail: 'ravi@ravigupta.dev',
      artistDetails: 'Founder lightning talks, AI demos, and curated networking over drinks.',
      faq: [
        { q: 'Who should attend?', a: 'Founders, product and engineering leaders, and AI builders.' },
      ],
      refundPolicy: 'Free event. Please release your spot if you can no longer attend.',
      parkingInfo: 'Wynyard Quarter paid parking buildings nearby. 10 min walk from Britomart.',
      meetGreet: 'Optional speed-intro session at 7 PM hosted by Ravi.',
      status: 'Draft',
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: uuid(),
      name: 'NZ Startup Summit 2025',
      date: '2025-05-14',
      venue: 'Aotea Centre',
      city: 'Auckland',
      flyerImage: EVENT_IMAGES.summit,
      ticketLink: 'https://tickets.ravigupta.dev/startup-summit',
      organiserName: 'Ravi Events Co.',
      organiserEmail: 'events@ravigupta.dev',
      artistDetails: 'Keynotes from NZ and AU founders, investor panels, and a startup expo.',
      faq: [
        { q: 'Do you offer student tickets?', a: 'Yes, student tickets are 50% off with valid ID.' },
      ],
      refundPolicy: 'Refundable up to 14 days before the summit. Name changes allowed any time.',
      parkingInfo: 'Civic and Aotea car parks adjacent. Discounted event parking available.',
      meetGreet: 'Investor office-hours bookable through the event app.',
      status: 'Completed',
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 40),
    },
    {
      id: uuid(),
      name: 'Holi Colour Festival Hamilton',
      date: '2025-12-06',
      venue: 'Claudelands Event Centre',
      city: 'Hamilton',
      flyerImage: EVENT_IMAGES.live,
      ticketLink: 'https://tickets.ravigupta.dev/holi-hamilton',
      organiserName: 'Ravi Events Co.',
      organiserEmail: 'events@ravigupta.dev',
      artistDetails: 'Live dhol, colour throws every hour, and a food truck village.',
      faq: [
        { q: 'Is colour powder provided?', a: 'Each ticket includes 2 colour packs; more available on-site.' },
      ],
      refundPolicy: 'Weather-protected indoor/outdoor venue. Refunds only if fully cancelled.',
      parkingInfo: 'Free on-site parking with overflow at Claudelands Park.',
      meetGreet: 'Family photo zone with professional photographers included.',
      status: 'Draft',
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 1),
    },
  ]

  const E = (i) => events[i]

  const messages = [
    {
      id: uuid(),
      customerName: 'Priya Sharma',
      channel: 'whatsapp',
      message: 'Is parking available at the venue?',
      eventId: E(0).id,
      eventName: E(0).name,
      aiSuggestedReply:
        'Hi Priya! Yes — paid parking is available at the Civic Car Park, just 50m from The Civic, with limited accessible parking on-site. Public transport is also a great option. See you at Bollywood Nights! 🎶',
      confidence: 0.94,
      category: 'General Enquiry',
      riskLevel: 'Low',
      status: 'Needs Review',
      createdAt: iso(now - 1000 * 60 * 35),
    },
    {
      id: uuid(),
      customerName: 'James Liu',
      channel: 'whatsapp',
      message: 'Can I get a refund? I can no longer attend.',
      eventId: E(2).id,
      eventName: E(2).name,
      aiSuggestedReply:
        'Hi James, thanks for reaching out. For the Punjabi Live Concert, tickets are strictly non-refundable once issued, except if the event is cancelled. However tickets are transferable — you are welcome to pass yours to a friend. Would you like help with that?',
      confidence: 0.88,
      category: 'Refund Request',
      riskLevel: 'High',
      status: 'Needs Review',
      createdAt: iso(now - 1000 * 60 * 90),
    },
    {
      id: uuid(),
      customerName: 'Aroha Williams',
      channel: 'whatsapp',
      message: 'Where is my ticket? I paid but did not receive an email.',
      eventId: E(1).id,
      eventName: E(1).name,
      aiSuggestedReply:
        'Hi Aroha! Your tickets are emailed instantly after purchase — please check your spam/promotions folder. If you still cannot find them, reply with the email used at checkout and we will resend right away. 🎟️',
      confidence: 0.83,
      category: 'General Enquiry',
      riskLevel: 'Medium',
      status: 'Draft',
      createdAt: iso(now - 1000 * 60 * 60 * 2),
    },
    {
      id: uuid(),
      customerName: 'Daniel Cooper',
      channel: 'whatsapp',
      message: 'Is meet and greet included with my ticket?',
      eventId: E(0).id,
      eventName: E(0).name,
      aiSuggestedReply:
        'Great question, Daniel! Meet & Greet is an optional VIP add-on for $79, which includes a backstage photo and signed poster. Standard tickets do not include it, but you can upgrade any time before the show.',
      confidence: 0.91,
      category: 'General Enquiry',
      riskLevel: 'Low',
      status: 'Approved',
      createdAt: iso(now - 1000 * 60 * 60 * 5),
    },
    {
      id: uuid(),
      customerName: 'Meera Patel',
      channel: 'whatsapp',
      message: 'Do you have a group booking discount for 15 people?',
      eventId: E(1).id,
      eventName: E(1).name,
      aiSuggestedReply:
        'Hi Meera! Yes — for groups of 10+ we offer 15% off reserved seating. I can hold 15 seats for you and send a group payment link. Shall I go ahead and reserve them?',
      confidence: 0.86,
      category: 'Group Booking',
      riskLevel: 'Low',
      status: 'Sent',
      createdAt: iso(now - 1000 * 60 * 60 * 26),
    },
    {
      id: uuid(),
      customerName: 'Sophie Anderson',
      channel: 'whatsapp',
      message: 'Can I sponsor this event? We are a local brand.',
      eventId: E(2).id,
      eventName: E(2).name,
      aiSuggestedReply:
        'Hi Sophie, wonderful! We have sponsorship tiers from on-stage branding to product sampling booths. I will connect you with our partnerships lead and share the sponsorship deck. What is the best email to reach you?',
      confidence: 0.79,
      category: 'Sponsorship Enquiry',
      riskLevel: 'Medium',
      status: 'Needs Review',
      createdAt: iso(now - 1000 * 60 * 60 * 30),
    },
    {
      id: uuid(),
      customerName: 'Raj Singh',
      channel: 'whatsapp',
      message: 'Can I book a vendor stall to sell food?',
      eventId: E(1).id,
      eventName: E(1).name,
      aiSuggestedReply:
        'Hi Raj! Food vendor stalls are available for the Diwali Mela. Stalls include a 3x3m space and power. I will send our vendor application form and pricing. Do you have a current food safety certificate?',
      confidence: 0.84,
      category: 'Vendor Enquiry',
      riskLevel: 'Low',
      status: 'Needs Review',
      createdAt: iso(now - 1000 * 60 * 60 * 33),
    },
    {
      id: uuid(),
      customerName: 'Emily Brown',
      channel: 'whatsapp',
      message: 'This is the third time I have asked and no one replied. Very disappointed!',
      eventId: E(2).id,
      eventName: E(2).name,
      aiSuggestedReply:
        'Hi Emily, I am really sorry for the delay and the frustration — that is not the experience we want for you. I am escalating this to a human team member right now who will personally follow up within the hour. Thank you for your patience. 🙏',
      confidence: 0.72,
      category: 'Complaint',
      riskLevel: 'High',
      status: 'Needs Review',
      createdAt: iso(now - 1000 * 60 * 15),
    },
  ]

  const leads = [
    { id: uuid(), name: 'Sophie Anderson', email: 'sophie@brightbrand.co.nz', phone: '+64 21 555 0102', category: 'Sponsorship Enquiry', stage: 'New', eventId: E(2).id, eventName: E(2).name, value: 8000, note: 'Local beverage brand, wants on-stage branding.', createdAt: iso(now - 1000 * 60 * 60 * 30) },
    { id: uuid(), name: 'Meera Patel', email: 'meera.p@gmail.com', phone: '+64 22 555 0190', category: 'Group Booking', stage: 'Interested', eventId: E(1).id, eventName: E(1).name, value: 1200, note: '15 reserved seats for family group.', createdAt: iso(now - 1000 * 60 * 60 * 26) },
    { id: uuid(), name: 'Raj Singh', email: 'raj@spicehut.co.nz', phone: '+64 27 555 0144', category: 'Vendor Enquiry', stage: 'Contacted', eventId: E(1).id, eventName: E(1).name, value: 450, note: 'Food stall, needs power + safety cert check.', createdAt: iso(now - 1000 * 60 * 60 * 33) },
    { id: uuid(), name: 'Daniel Cooper', email: 'dan.cooper@outlook.com', phone: '+64 21 555 0177', category: 'Hot Lead', stage: 'Converted', eventId: E(0).id, eventName: E(0).name, value: 320, note: 'Upgraded 4 tickets to VIP meet & greet.', createdAt: iso(now - 1000 * 60 * 60 * 5) },
    { id: uuid(), name: 'James Liu', email: 'jliu@fastmail.com', phone: '+64 22 555 0166', category: 'Refund Request', stage: 'Contacted', eventId: E(2).id, eventName: E(2).name, value: 0, note: 'Wants refund — offered transfer instead.', createdAt: iso(now - 1000 * 60 * 90) },
    { id: uuid(), name: 'Emily Brown', email: 'emily.b@gmail.com', phone: '+64 27 555 0133', category: 'Complaint', stage: 'New', eventId: E(2).id, eventName: E(2).name, value: 0, note: 'Escalated — unhappy with response time.', createdAt: iso(now - 1000 * 60 * 15) },
    { id: uuid(), name: 'Kahu Ngata', email: 'kahu@corpevents.nz', phone: '+64 21 555 0121', category: 'Hot Lead', stage: 'Interested', eventId: E(3).id, eventName: E(3).name, value: 5000, note: 'Wants to host a corporate table at the mixer.', createdAt: iso(now - 1000 * 60 * 60 * 12) },
    { id: uuid(), name: 'Wei Zhang', email: 'wei.zhang@startuphub.io', phone: '+64 22 555 0118', category: 'General Enquiry', stage: 'New', eventId: E(3).id, eventName: E(3).name, value: 0, note: 'Asked about agenda + speaker list.', createdAt: iso(now - 1000 * 60 * 60 * 20) },
    { id: uuid(), name: 'Olivia Martin', email: 'olivia@eventcrew.co.nz', phone: '+64 27 555 0155', category: 'Vendor Enquiry', stage: 'Closed', eventId: E(1).id, eventName: E(1).name, value: 0, note: 'Craft stall — declined, fully booked.', createdAt: iso(now - 1000 * 60 * 60 * 48) },
  ]

  const contentGenerations = [
    {
      id: uuid(),
      eventId: E(0).id,
      eventName: E(0).name,
      type: 'Instagram caption',
      prompt: 'High energy, fun, include emojis and ticket CTA',
      content:
        '✨ BOLLYWOOD NIGHTS is coming to Auckland! ✨\nGet ready for a night of dhol, dance and pure desi magic at The Civic 🎶🪩\n📅 Sep 20 | 🎟️ Link in bio\nTag the squad you are bringing 👇 #BollywoodNightsAKL #AucklandEvents',
      createdAt: iso(now - 1000 * 60 * 60 * 8),
    },
    {
      id: uuid(),
      eventId: E(1).id,
      eventName: E(1).name,
      type: 'Email announcement',
      prompt: 'Warm, community focused, mention fireworks and free entry',
      content:
        'Subject: You are invited — Diwali Mela Wellington 🪔\n\nKia ora,\n\nJoin us for a magical evening of light, culture and community at TSB Arena on Oct 25. Enjoy 40+ food and craft stalls, cultural performances, and a spectacular fireworks finale at 9:15 PM.\n\nEntry is free — bring your whānau and friends!\n\nWarm wishes,\nRavi Events Co.',
      createdAt: iso(now - 1000 * 60 * 60 * 14),
    },
    {
      id: uuid(),
      eventId: E(4).id,
      eventName: E(4).name,
      type: 'LinkedIn post',
      prompt: 'Professional, recap tone, thank attendees and investors',
      content:
        'That is a wrap on NZ Startup Summit 2025! 🚀\n\nThank you to the 600+ founders, operators and investors who joined us at the Aotea Centre. From bold keynotes to candid investor panels, the energy in Auckland\'s startup community is electric.\n\nGrateful to our speakers and partners. Until next year. 🙌\n\n#NZStartup #Auckland #Founders',
      createdAt: iso(now - 1000 * 60 * 60 * 24 * 30),
    },
  ]

  const auditLogs = [
    { id: uuid(), action: 'ai.reply.generated', actor: 'AI Assistant', detail: `Draft reply generated for "${E(0).name}" enquiry`, riskLevel: 'Low', createdAt: iso(now - 1000 * 60 * 35) },
    { id: uuid(), action: 'approval.approved', actor: 'Ravi Gupta', detail: 'Approved meet & greet reply to Daniel Cooper', riskLevel: 'Low', createdAt: iso(now - 1000 * 60 * 60 * 5) },
    { id: uuid(), action: 'ai.reply.flagged', actor: 'AI Safety Guardrail', detail: 'Refund request flagged High risk — human approval required', riskLevel: 'High', createdAt: iso(now - 1000 * 60 * 90) },
    { id: uuid(), action: 'content.generated', actor: 'AI Assistant', detail: `Instagram caption generated for "${E(0).name}"`, riskLevel: 'Low', createdAt: iso(now - 1000 * 60 * 60 * 8) },
    { id: uuid(), action: 'message.sent', actor: 'Ravi Gupta', detail: 'Group booking reply sent to Meera Patel', riskLevel: 'Low', createdAt: iso(now - 1000 * 60 * 60 * 24) },
    { id: uuid(), action: 'lead.created', actor: 'AI Classifier', detail: 'New sponsorship lead captured from WhatsApp enquiry', riskLevel: 'Medium', createdAt: iso(now - 1000 * 60 * 60 * 30) },
  ]

  return { events, messages, leads, contentGenerations, auditLogs }
}
