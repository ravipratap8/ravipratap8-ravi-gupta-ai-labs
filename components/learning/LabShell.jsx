'use client'

import Link from 'next/link'
import { ArrowLeft, FlaskConical, Home, ShieldCheck } from 'lucide-react'

export function LabShell({ eyebrow, title, intro, children }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400 text-slate-950">RG</span>
            Ravi Gupta AI Labs
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/learning" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
              <FlaskConical className="h-4 w-4" /> Learning Lab
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
              <Home className="h-4 w-4" /> Home
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-white/5 bg-grid">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <Link href="/learning" className="mb-6 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="h-4 w-4" /> All learning modules
          </Link>
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">{eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{intro}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> Learn by making an engineering decision, then inspect the reasoning.
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12">{children}</div>
    </main>
  )
}

export function ExerciseCard({ number, title, context, options, selected, onSelect, answer, explanation }) {
  const answered = selected !== null && selected !== undefined
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-400/15 font-display font-bold text-cyan-300">{number}</span>
        <div>
          <h2 className="font-display text-xl font-bold md:text-2xl">{title}</h2>
          <p className="mt-2 leading-relaxed text-slate-300">{context}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = answered && index === answer
          const isWrongSelected = answered && isSelected && index !== answer
          return (
            <button
              key={option}
              onClick={() => onSelect(index)}
              className={`rounded-2xl border p-4 text-left text-sm leading-relaxed transition ${
                isCorrect
                  ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-100'
                  : isWrongSelected
                    ? 'border-rose-400/50 bg-rose-400/10 text-rose-100'
                    : isSelected
                      ? 'border-cyan-400/50 bg-cyan-400/10 text-white'
                      : 'border-white/10 bg-slate-900/50 text-slate-300 hover:border-cyan-400/30 hover:bg-white/[0.04]'
              }`}
            >
              <span className="mr-2 font-semibold text-slate-500">{String.fromCharCode(65 + index)}.</span>{option}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className={`mt-5 rounded-2xl border p-4 ${selected === answer ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-amber-400/20 bg-amber-400/5'}`}>
          <p className="text-sm font-semibold text-white">{selected === answer ? 'Good engineering choice.' : 'There is a stronger choice.'}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{explanation}</p>
        </div>
      )}
    </section>
  )
}
