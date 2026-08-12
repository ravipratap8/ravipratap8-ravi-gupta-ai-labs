import Link from 'next/link'
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, Code2, FlaskConical, GraduationCap, Sparkles } from 'lucide-react'
import { LEARNING_TRACKS, ALL_MODULES } from '@/lib/learning-catalog'
import { LearningExplorer } from '@/components/learning/LearningExplorer'

export const metadata = {
  title: 'Free Technical Learning Hub | Ravi Gupta AI Labs',
  description: 'Free hands-on learning for AI engineering, test automation, API testing, quality engineering, CI/CD, observability, MCP, SQL, accessibility and performance.',
}

const LIVE_LABS = [
  { title: 'AI Workflow & Governance Lab', href: '/learning/ai', text: 'Make confidence, risk, grounding and human-approval decisions in realistic AI scenarios.' },
  { title: 'Playwright Test Automation Lab', href: '/learning/playwright', text: 'Practise selectors, assertions, synchronization and maintainability decisions.' },
  { title: 'API Testing Beyond Status Codes', href: '/learning/api-testing', text: 'Work through contracts, negative paths, state transitions and business invariants.' },
]

export default function LearningPage() {
  const lessonCount = ALL_MODULES.reduce((total, module) => total + module.lessons.length, 0)
  const challengeCount = ALL_MODULES.reduce((total, module) => total + module.challenges.length, 0)

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/5 bg-grid">
        <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">← ravigupta.dev</Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300"><FlaskConical className="h-4 w-4" /> Free Technical Learning Hub</div>
              <h1 className="mt-6 max-w-5xl font-display text-5xl font-bold tracking-tight md:text-7xl">Learn the skills modern engineering work actually demands.</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">A free, practical learning space for people who need to keep growing as AI changes software engineering, quality, automation and delivery. Read the concept, make the engineering decision, then do the hands-on challenge.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#curriculum" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">Explore curriculum <ArrowRight className="h-4 w-4" /></a>
                <Link href="/learning/playwright" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08]"><Code2 className="h-4 w-4" /> Start a live lab</Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <Sparkles className="h-6 w-6 text-violet-300" />
              <p className="mt-4 font-display text-xl font-semibold">No paywall. No certificate theatre.</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">The goal is useful capability: AI, automation, APIs, data, CI/CD, observability, accessibility, performance and engineering judgement that scales with your career.</p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[['6', 'learning tracks'], [String(ALL_MODULES.length), 'practical modules'], [String(lessonCount), 'guided lessons'], [String(challengeCount), 'hands-on challenges']].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="font-display text-3xl font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: BookOpenCheck, title: 'Learn the concept', text: 'Short explanations focus on the engineering idea and why it matters in production.' },
            { icon: FlaskConical, title: 'Practise the decision', text: 'Interactive scenarios and practical challenges force you to choose, design or test something.' },
            { icon: BriefcaseBusiness, title: 'Apply it at work', text: 'Turn the lesson into evidence you can reuse in a real project, test strategy, codebase or architecture discussion.' },
          ].map((item) => <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><item.icon className="h-6 w-6 text-cyan-300" /><h2 className="mt-4 font-display text-xl font-bold">{item.title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p></div>)}
        </div>
      </section>

      <section className="border-y border-white/5 bg-cyan-950/10">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Interactive labs</p><h2 className="mt-2 font-display text-3xl font-bold">Start with a decision-based exercise</h2></div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400">These are the original scenario labs. They stay available as fast practice alongside the broader curriculum.</p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {LIVE_LABS.map((lab) => <Link key={lab.href} href={lab.href} className="group rounded-3xl border border-cyan-400/15 bg-slate-950/60 p-6 transition hover:-translate-y-1 hover:border-cyan-400/35"><GraduationCap className="h-6 w-6 text-cyan-300" /><h3 className="mt-4 font-display text-xl font-bold">{lab.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{lab.text}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-cyan-400">Open lab <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}
          </div>
        </div>
      </section>

      <section id="curriculum" className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Full curriculum</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">Build breadth without losing practical depth.</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">Use the tracks in order if you want structure, or search for the exact skill you need today. Every module includes learning outcomes, guided content and hands-on work.</p>
        </div>
        <LearningExplorer tracks={LEARNING_TRACKS} />
      </section>

      <section className="border-t border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="rounded-3xl border border-violet-400/20 bg-violet-400/5 p-7 md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">A useful rule</p>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">Do not collect modules. Build evidence.</h2>
            <p className="mt-3 max-w-4xl leading-relaxed text-slate-300">After every module, create something tangible: a test matrix, Playwright test, API suite, SQL query, pipeline rule, risk model, prompt evaluation dataset, MCP tool schema or observability checklist. That is what turns learning into capability.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
