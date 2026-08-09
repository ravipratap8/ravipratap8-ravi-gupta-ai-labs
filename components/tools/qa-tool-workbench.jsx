'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Upload, FileText, Sparkles, Copy, Download, RotateCcw,
  ShieldCheck, CheckCircle2, AlertTriangle, Loader2, Info, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const ACCEPT = '.pdf,.doc,.docx,.txt,.md,.csv,.json,.xml,.yaml,.yml'

function ResultBlock({ result }) {
  const blocks = useMemo(() => String(result || '').split(/\n{2,}/), [result])
  return (
    <div className="space-y-4 text-sm leading-7 text-slate-200">
      {blocks.map((block, index) => {
        const lines = block.split('\n')
        const first = lines[0]
        if (first.startsWith('# ')) return <h2 key={index} className="pt-2 font-display text-2xl font-bold text-white">{first.slice(2)}</h2>
        if (first.startsWith('## ')) return <div key={index}><h3 className="font-display text-lg font-semibold text-cyan-200">{first.slice(3)}</h3>{lines.slice(1).map((line, i) => <Line key={i} line={line} />)}</div>
        if (first.startsWith('### ')) return <div key={index}><h4 className="font-semibold text-white">{first.slice(4)}</h4>{lines.slice(1).map((line, i) => <Line key={i} line={line} />)}</div>
        return <div key={index}>{lines.map((line, i) => <Line key={i} line={line} />)}</div>
      })}
    </div>
  )
}

function Line({ line }) {
  if (!line) return <div className="h-2" />
  if (line.startsWith('> ')) return <div className="my-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-amber-100">{line.slice(2)}</div>
  if (/^[-*] /.test(line)) return <div className="flex gap-2"><span className="text-cyan-400">•</span><span>{line.slice(2)}</span></div>
  if (/^\d+\. /.test(line)) return <div>{line}</div>
  if (line.startsWith('|')) return <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/70 p-3 text-xs text-slate-300">{line}</pre>
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  return <p>{parts.map((p, i) => p.startsWith('**') && p.endsWith('**') ? <strong key={i} className="text-white">{p.slice(2,-2)}</strong> : p)}</p>
}

export default function QAToolWorkbench({ tool }) {
  const fileRef = useRef(null)
  const [input, setInput] = useState('')
  const [context, setContext] = useState('')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState('')
  const [mode, setMode] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!input.trim() && !file) {
      toast.error('Paste a requirement or upload a document first.')
      return
    }
    setLoading(true)
    setResult('')
    try {
      const body = new FormData()
      body.append('slug', tool.slug)
      body.append('input', input)
      body.append('context', context)
      if (file) body.append('file', file)
      const response = await fetch('/api/tools/generate', { method: 'POST', body })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Generation failed')
      setResult(payload.result)
      setMode(payload.mode)
      toast.success('QA deliverable generated')
    } catch (error) {
      toast.error(error.message || 'Unable to generate result')
    } finally {
      setLoading(false)
    }
  }

  async function copyResult() {
    await navigator.clipboard.writeText(result)
    toast.success('Copied to clipboard')
  }

  function downloadResult() {
    const blob = new Blob([result], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tool.slug}-${new Date().toISOString().slice(0,10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  function reset() {
    setInput(''); setContext(''); setFile(null); setResult(''); setMode('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/tools" className="flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> All useful tools</Link>
          <div className="flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="h-4 w-4 text-cyan-400" /> Human review recommended</div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">{tool.badge || 'QA Workbench'}</div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">{tool.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">{tool.description}</p>
          <p className="mt-2 text-sm text-slate-500">Output: {tool.output}</p>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div><p className="font-display text-lg font-semibold">1. Provide source material</p><p className="mt-1 text-xs text-slate-500">Paste text, upload a document, or use both.</p></div>
              {(input || file || context) && <Button variant="ghost" size="sm" onClick={reset} className="text-slate-400 hover:text-white"><RotateCcw className="mr-1 h-4 w-4" /> Reset</Button>}
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-200">{tool.inputLabel}</label>
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste the requirement, user story, BRD, release notes, test cases or other source material here..." className="mt-2 min-h-[300px] border-slate-700 bg-slate-900/70 text-white placeholder:text-slate-600" />
              <div className="mt-2 flex justify-between text-[11px] text-slate-500"><span>Keep sensitive production data out of public tools.</span><span>{input.length.toLocaleString()} chars</span></div>
            </div>

            <div className="my-5 flex items-center gap-3 text-xs text-slate-600"><span className="h-px flex-1 bg-white/10" />OR ATTACH DOCUMENT<span className="h-px flex-1 bg-white/10" /></div>

            <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {!file ? (
              <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-5 py-8 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/5">
                <Upload className="h-6 w-6 text-cyan-400" /><div><p className="font-medium">Browse a requirement document</p><p className="mt-1 text-xs text-slate-500">PDF, Word, TXT, Markdown, CSV, JSON, XML · max 3 MB</p></div>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4"><div className="flex min-w-0 items-center gap-3"><FileText className="h-5 w-5 shrink-0 text-cyan-300" /><div className="min-w-0"><p className="truncate text-sm font-medium">{file.name}</p><p className="text-xs text-slate-500">{(file.size/1024).toFixed(1)} KB</p></div></div><button onClick={() => setFile(null)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X className="h-4 w-4" /></button></div>
            )}

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-200">Optional context</label>
              <Input value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g. SAP EWM change, web app, mobile, API, sprint release..." className="mt-2 border-slate-700 bg-slate-900/70 text-white" />
            </div>

            <Button onClick={generate} disabled={loading} className="mt-6 h-12 w-full bg-gradient-to-r from-cyan-400 to-sky-500 font-semibold text-slate-950 hover:opacity-90">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analysing source...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate {tool.shortTitle}</>}
            </Button>
          </section>

          <section className="min-h-[620px] rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-5">
              <div><p className="font-display text-lg font-semibold">2. Review the output</p><p className="mt-1 text-xs text-slate-500">Treat generated content as a draft. Validate it against the source before use.</p></div>
              {result && <div className="flex gap-2"><Button size="sm" variant="outline" onClick={copyResult} className="border-slate-700 bg-white/5"><Copy className="mr-1 h-4 w-4" />Copy</Button><Button size="sm" variant="outline" onClick={downloadResult} className="border-slate-700 bg-white/5"><Download className="mr-1 h-4 w-4" />.md</Button></div>}
            </div>

            {!result && !loading && <div className="grid min-h-[500px] place-items-center"><div className="max-w-sm text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Sparkles className="h-7 w-7" /></div><p className="mt-4 font-medium">Your QA deliverable will appear here</p><p className="mt-2 text-sm leading-6 text-slate-500">The tool will use your source material, identify gaps rather than hiding them, and structure the result for practical QA work.</p></div></div>}
            {loading && <div className="grid min-h-[500px] place-items-center"><div className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" /><p className="mt-4 text-sm text-slate-400">Analysing requirements and building QA coverage...</p></div></div>}
            {result && <div className="mt-6"><div className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 ${mode === 'ai' ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-amber-400/20 bg-amber-400/5'}`}>{mode === 'ai' ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" /> : <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />}<div><p className="text-sm font-medium">{mode === 'ai' ? 'AI-assisted analysis complete' : 'Local rules-based result'}</p><p className="mt-1 text-xs text-slate-400">{mode === 'ai' ? 'Source material was analysed using the configured OpenAI model. Human validation is still required.' : 'OPENAI_API_KEY is not configured. This fallback is useful for structure, but deeper analysis needs the AI service.'}</p></div></div><ResultBlock result={result} /></div>}
          </section>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400"><Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" /><p>These tools assist professional judgement; they do not replace requirement clarification, domain expertise, test execution or release accountability. Uploaded documents are sent to the configured AI provider only when AI analysis is enabled.</p></div>
      </section>
    </main>
  )
}
