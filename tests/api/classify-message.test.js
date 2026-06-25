import { describe, it, expect } from 'vitest'
import { classifyMessage } from '../../lib/ai/mock-engine'

describe('classifyMessage', () => {
  it('flags refunds as High risk', () => {
    const r = classifyMessage('Can I get a refund please?')
    expect(r.category).toBe('Refund Request')
    expect(r.riskLevel).toBe('High')
  })
  it('detects sponsorship enquiries', () => {
    expect(classifyMessage('We would like to sponsor your event').category).toBe('Sponsorship Enquiry')
  })
  it('defaults to General Enquiry', () => {
    expect(classifyMessage('What time do doors open?').category).toBe('General Enquiry')
  })
})
