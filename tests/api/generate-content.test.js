import { describe, it, expect } from 'vitest'
import { generateContent } from '../../lib/ai/mock-engine'

const event = { name: 'Bollywood Nights', date: '2025-09-20', venue: 'The Civic', city: 'Auckland', ticketLink: 'https://x', artistDetails: 'Live band' }

describe('generateContent', () => {
  it('generates a non-empty Instagram caption', () => {
    const r = generateContent('Instagram caption', event, 'fun')
    expect(r.content.length).toBeGreaterThan(20)
    expect(r.content).toContain('Bollywood Nights'.toUpperCase())
  })
  it('generates a reel script with timestamps', () => {
    expect(generateContent('45-second reel script', event).content).toContain('[0:00')
  })
})
