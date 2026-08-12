'use client'

import { useMemo, useState } from 'react'
import { Check, CheckCircle2, Circle, RotateCcw } from 'lucide-react'

export function ModuleWorkspace({ module }) {
  const [completedLessons, setCompletedLessons] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])

  const total = module.lessons.length + module.challenges.length
  const completed = completedLessons.length + completedChallenges.length
  const progress = total ? Math.round((completed / total) * 100) : 0

  const toggle = (value, list, setter) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  const statusText = useMemo(() => {
    if (progress === 100) return 'Module complete. Revisit the challenges with a real system or project.'
    if (progress >= 50) return 'Good progress. Keep going and turn at least one challenge into working evidence.'
    return 'Work through the lessons, then complete the hands-on challenges.'
  }, [progress])

  const reset = () => {
    setCompletedLessons([])
    setCompletedChallenges([])
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Learning outcomes</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {module.outcomes.map((outcome) => (
              <div key={outcome} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                {outcome}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Guided lessons</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Learn the engineering thinking</h2>
          </div>
          <div className="space-y-4">
            {module.lessons.map((lesson, index) => {
              const done = completedLessons.includes(index)
              return (
                <article key={lesson.title} className={`rounded-3xl border p-6 transition ${done ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-white/10 bg-white/[0.03]'}`}>
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggle(index, completedLessons, setCompletedLessons)} aria-label={`Mark lesson ${index + 1} complete`} className="mt-0.5 shrink-0 text-slate-500 hover:text-cyan-300">
                      {done ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <Circle className="h-6 w-6" />}
                    </button>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Lesson {index + 1}</p>
                      <h3 className="mt-1 font-display text-xl font-bold text-white">{lesson.title}</h3>
                      <p className="mt-3 leading-relaxed text-slate-300">{lesson.body}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">Hands-on practice</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Do something with what you learned</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">Do not just tick these mentally. Write the query, create the test matrix, refactor the code, or document the decision. Practical evidence is the point.</p>
          </div>
          <div className="space-y-4">
            {module.challenges.map((challenge, index) => {
              const done = completedChallenges.includes(index)
              return (
                <button key={challenge} onClick={() => toggle(index, completedChallenges, setCompletedChallenges)} className={`w-full rounded-3xl border p-5 text-left transition ${done ? 'border-violet-400/30 bg-violet-400/10' : 'border-white/10 bg-white/[0.03] hover:border-violet-400/30'}`}>
                  <div className="flex items-start gap-4">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${done ? 'bg-violet-400 text-slate-950' : 'bg-violet-400/10 text-violet-300'}`}>
                      {done ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">Challenge</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-200">{challenge}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold text-white">Your progress</p>
            <button onClick={reset} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white" aria-label="Reset progress"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span>{completed} of {total} activities</span><span>{progress}%</span></div>
          <p className="mt-5 text-sm leading-relaxed text-slate-400">{statusText}</p>
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Use this at work</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">Take one challenge and apply it to a real feature, API, pipeline, AI workflow or test suite. Learning compounds when it produces reusable evidence.</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
