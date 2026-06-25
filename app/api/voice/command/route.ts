import { NextResponse } from 'next/server'
import { z } from 'zod'
import { routeCommand } from '@/lib/voice/intentRouter'

// POST /api/voice/command — resolve a transcript into a typed intent + action.
// This specific route takes precedence over the catch-all /api handler.

const bodySchema = z.object({
  transcript: z.string().min(1).max(500),
})

function cors<T extends NextResponse>(res: T): T {
  res.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res
}

export async function OPTIONS(): Promise<NextResponse> {
  return cors(new NextResponse(null, { status: 200 }))
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const json: unknown = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return cors(
        NextResponse.json(
          {
            success: false,
            intent: 'fallback',
            category: 'fallback',
            confidence: 0,
            actionType: 'none',
            response: 'Please provide a transcript, e.g. "open approvals".',
          },
          { status: 400 },
        ),
      )
    }
    const result = routeCommand(parsed.data.transcript)
    return cors(NextResponse.json(result))
  } catch {
    return cors(
      NextResponse.json(
        {
          success: false,
          intent: 'fallback',
          category: 'fallback',
          confidence: 0,
          actionType: 'none',
          response: 'Voice command could not be processed.',
        },
        { status: 500 },
      ),
    )
  }
}
