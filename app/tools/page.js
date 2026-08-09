import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react'
import { QA_TOOLS, TOOL_GROUPS } from '@/lib/tools/catalog'

export const metadata = {
  title: 'Useful QA Tools | Ravi Gupta',
  description:
    'Free practical QA and testing tools for test cases, test plans, risk analysis, traceability, test data, regression and release readiness.',
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <span className="text-sm font-medium text-cyan-300">
          Useful Tools
        </span>
      </div>

      <section className="relative overflow-hidden border-b border-white/5 py-16 md:py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
              <FlaskConical className="h-3.5 w-3.5" />
              Built for working QA professionals
            </div>

            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
              Useful QA tools that produce real testing artefacts.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Paste a requirement or upload a source document. Generate test
              cases, test plans, risk analysis, traceability, regression scope,
              release-readiness assessments and more. These tools are designed
              to help testers move faster while keeping human review and QA
              judgement in control.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                {QA_TOOLS.length} practical tools
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Document input
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Copy / export results
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Built for QA workflows
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        {TOOL_GROUPS.map((group) => {
          const tools = QA_TOOLS.filter(
            (tool) => tool.group === group.id
          )

          return (
            <div
              key={group.id}
              className="mb-16 last:mb-0"
            >
              <div className="mb-7">
                <h2 className="font-display text-2xl font-bold md:text-3xl">
                  {group.label}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {group.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
                        <tool.icon className="h-5 w-5" />
                      </span>

                      {tool.badge && (
                        <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-medium text-violet-200">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 font-display text-lg font-semibold group-hover:text-cyan-200">
                      {tool.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {tool.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        Open tool
                      </span>

                      <ArrowRight className="h-4 w-4 text-cyan-400 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        <div className="mt-12">
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-6">
            <ShieldCheck className="h-6 w-6 text-emerald-300" />

            <h3 className="mt-3 font-display text-lg font-semibold">
              Designed around QA governance
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              The tools are designed to surface assumptions, missing evidence,
              unresolved questions and coverage gaps instead of quietly treating
              incomplete requirements as complete. Results should always be
              reviewed by a tester before being used in delivery.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}