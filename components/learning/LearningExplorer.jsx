'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Cpu,
  Network,
  Search,
  ShieldCheck,
} from 'lucide-react'

const ICONS = { BrainCircuit, Code2, Network, Activity, ShieldCheck, Cpu }

export function LearningExplorer({ tracks }) {
  const [query, setQuery] = useState('')
  const [activeTrack, setActiveTrack] = useState('all')

  const filteredTracks = useMemo(() => {
    const term = query.trim().toLowerCase()
    return tracks
      .filter((track) => activeTrack === 'all' || track.id === activeTrack)
      .map((track) => ({
        ...track,
        modules: track.modules.filter((module) => {
          if (!term) return true
          return [module.title, module.summary, module.level, ...module.tags]
            .join(' ')
            .toLowerCase()
            .includes(term)
        }),
      }))
      .filter((track) => track.modules.length > 0)
  }, [tracks, query, activeTrack])

  return (
    <>
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search AI, Playwright, API, SQL, CI/CD, MCP, accessibility..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveTrack('all')} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${activeTrack === 'all' ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-slate-300 hover:border-cyan-400/30'}`}>
              All tracks
            </button>
            {tracks.map((track) => (
              <button key={track.id} onClick={() => setActiveTrack(track.id)} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${activeTrack === track.id ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 text-slate-300 hover:border-cyan-400/30'}`}>
                {track.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-14">
        {filteredTracks.map((track) => {
          const Icon = ICONS[track.icon] || Code2
          return (
            <section key={track.id} id={track.id}>
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Icon className="h-6 w-6" /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Learning track</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">{track.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{track.description}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {track.modules.map((module) => (
                  <Link key={module.slug} href={`/learning/modules/${module.slug}`} className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-400">{module.level}</span>
                      <span className="text-xs text-slate-500">{module.duration}</span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-white">{module.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{module.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {module.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] text-slate-400">{tag}</span>)}
                    </div>
                    <div className="mt-6 border-t border-white/10 pt-5">
                      <div className="space-y-2">
                        {module.outcomes.slice(0, 2).map((outcome) => (
                          <div key={outcome} className="flex items-start gap-2 text-xs text-slate-400"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />{outcome}</div>
                        ))}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-cyan-400">Open module <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {filteredTracks.length === 0 && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <p className="font-display text-xl font-bold text-white">No module matched that search.</p>
          <p className="mt-2 text-sm text-slate-400">Try a broader term such as API, AI, automation, data or CI/CD.</p>
        </div>
      )}
    </>
  )
}
