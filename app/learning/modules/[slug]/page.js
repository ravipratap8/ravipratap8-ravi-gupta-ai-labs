import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock3, FlaskConical } from 'lucide-react'
import { ALL_MODULES, getLearningModule } from '@/lib/learning-catalog'
import { ModuleWorkspace } from '@/components/learning/ModuleWorkspace'

export function generateStaticParams() {
  return ALL_MODULES.map((module) => ({ slug: module.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const module = getLearningModule(slug)
  if (!module) return { title: 'Learning Module | Ravi Gupta AI Labs' }
  return {
    title: `${module.title} | Ravi Gupta AI Labs`,
    description: module.summary,
  }
}

export default async function LearningModulePage({ params }) {
  const { slug } = await params
  const module = getLearningModule(slug)
  if (!module) notFound()

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400 text-slate-950">RG</span> Ravi Gupta AI Labs</Link>
          <Link href="/learning" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><FlaskConical className="h-4 w-4" /> Learning Hub</Link>
        </div>
      </header>

      <section className="border-b border-white/5 bg-grid">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
          <Link href="/learning" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> All learning tracks</Link>
          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 font-semibold text-cyan-300">{module.trackTitle}</span>
              <span>{module.level}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {module.duration}</span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">{module.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{module.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">{module.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">{tag}</span>)}</div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <ModuleWorkspace module={module} />
      </div>
    </main>
  )
}
