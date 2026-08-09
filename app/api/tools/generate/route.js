import { NextResponse } from 'next/server'
import { getTool } from '@/lib/tools/catalog'
import { fallbackResult } from '@/lib/tools/fallback'

export const runtime = 'nodejs'

const MAX_FILE_BYTES = 3 * 1024 * 1024
const MAX_TEXT_CHARS = 120000

function isFileLike(value) {
  return value && typeof value === 'object' && typeof value.arrayBuffer === 'function' && typeof value.size === 'number'
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) return payload.output_text.trim()
  const parts = []
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === 'output_text' && content?.text) parts.push(content.text)
    }
  }
  return parts.join('\n').trim()
}

export async function POST(request) {
  try {
    const form = await request.formData()
    const slug = String(form.get('slug') || '')
    const input = String(form.get('input') || '').slice(0, MAX_TEXT_CHARS)
    const context = String(form.get('context') || '').slice(0, 12000)
    const file = form.get('file')
    const tool = getTool(slug)

    if (!tool) return NextResponse.json({ error: 'Unknown QA tool.' }, { status: 404 })
    if (!input.trim() && !(isFileLike(file) && file.size)) {
      return NextResponse.json({ error: 'Paste content or upload a document first.' }, { status: 400 })
    }
    if (isFileLike(file) && file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File is too large. Maximum size is 3 MB.' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ result: fallbackResult(tool, input || file?.name || ''), mode: 'local' })
    }

    const content = [{
      type: 'input_text',
      text: `TOOL: ${tool.title}\n\nTASK INSTRUCTIONS:\n${tool.prompt}\n\nUSER CONTEXT (optional):\n${context || 'None provided.'}\n\nPASTED SOURCE MATERIAL:\n${input || 'No pasted text. Analyse the attached document.'}\n\nOUTPUT REQUIREMENTS:\n- Produce a professional QA deliverable that can be copied into Jira, Azure DevOps, Confluence or a test-management tool.\n- Use Markdown headings and tables where helpful.\n- Be specific and concise.\n- Ground conclusions in the supplied source.\n- Explicitly label assumptions, gaps and questions.\n- Do not claim execution or evidence that was not supplied.`,
    }]

    if (isFileLike(file) && file.size) {
      const buffer = Buffer.from(await file.arrayBuffer())
      content.push({
        type: 'input_file',
        filename: file.name,
        file_data: buffer.toString('base64'),
      })
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5',
        store: false,
        input: [{ role: 'user', content }],
      }),
    })

    const payload = await response.json()
    if (!response.ok) {
      console.error('OpenAI tool generation failed:', payload)
      return NextResponse.json({ error: payload?.error?.message || 'AI analysis failed.' }, { status: 502 })
    }

    const result = extractOutputText(payload)
    if (!result) return NextResponse.json({ error: 'No usable result was returned.' }, { status: 502 })

    return NextResponse.json({ result, mode: 'ai' })
  } catch (error) {
    console.error('QA tool error:', error)
    return NextResponse.json({ error: 'Unable to process this request.' }, { status: 500 })
  }
}
