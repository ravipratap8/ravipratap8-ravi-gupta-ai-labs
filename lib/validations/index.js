import { z } from 'zod'

export const eventSchema = z.object({
  name: z.string().min(2, 'Event name is required'),
  date: z.string().optional(),
  venue: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['Draft', 'Published', 'Completed']).default('Draft'),
  ticketLink: z.string().url().optional().or(z.literal('')),
  organiserEmail: z.string().email().optional().or(z.literal('')),
})

export const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  category: z.string(),
  stage: z.enum(['New', 'Contacted', 'Interested', 'Converted', 'Closed']).default('New'),
  value: z.coerce.number().default(0),
})
