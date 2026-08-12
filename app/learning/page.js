import Link from 'next/link'
import { ArrowRight, BrainCircuit, Code2, FlaskConical, Network, ShieldCheck, Sparkles } from 'lucide-react'
import { LEARNING_MODULES } from '@/lib/brand'

const icons = [BrainCircuit, Code2, Network]

export const metadata = {
  title: 'Interactive Learning Lab | Ravi Gupta AI Labs',
  description: 'Interactive learning modules for AI governance, Playwright test automation and API testing.',
}

export default function LearningPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/5 bg-grid">
        <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← ravigupta.dev</Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                <FlaskConical className="h-4 w-4" /> Interactive Engineering Learning
              </div>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold tracking-tight md:text-7xl">Don’t just read it. Make the engineering decision.</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
                Short scenario-based labs for people learning modern quality engineering and applied AI. Each exercise focuses on judgement, trade-offs and production thinking rather than memorising tool syntax.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <Sparkles className="h-6 w-6 text-violet-300" />
              <p className="mt-4 font-display text-xl font-semibold">Why this exists</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">AI can generate code and answers quickly. The harder skill is deciding what should be trusted, tested, rejected, escalated or automated. These labs practise that skill.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {LEARNING_MODULES.map((module, index) => {
            const Icon = icons[index]
            return (
              <Link key={module.href} href={module.href} className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon className="h-6 w-6" /></span>
                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan-400">{module.eyebrow}</p>
                <h2 className="mt-2 font-display text-2xl font-bold">{module.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{module.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {module.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400">{tag}</span>)}
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                  <span className="text-slate-500">{module.level} · {module.lessons}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-cyan-400">Start lab <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-violet-400/20 bg-violet-400/5 p-7">
            <ShieldCheck className="h-6 w-6 text-violet-300" />
            <h3 className="mt-4 font-display text-xl font-bold">Quality mindset first</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Tools change. The durable skill is recognising risk, designing evidence and knowing when automation or AI output is insufficient.</p>
          </div>
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-7">
            <Code2 className="h-6 w-6 text-cyan-300" />
            <h3 className="mt-4 font-display text-xl font-bold">More labs coming</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Planned topics include requirement analysis, test design, AI-generated test validation, defect reasoning, regression impact and release-readiness decisions.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
