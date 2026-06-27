import { LearningHero } from '@/components/ai-learning/LearningHero'
import { LessonCard } from '@/components/ai-learning/LessonCard'
import { lessons } from '@/lib/ai-learning/lessons'

export const metadata = {
  title: 'AI Learning | Ravi Gupta AI Labs',
  description:
    'Interactive visual lessons for enterprise AI concepts including RAG, governance, hallucinations, confidence scoring, human approval, testing and MCP.',
}

export default function AILearningPage() {
  return (
    <main className="container mx-auto max-w-7xl px-6 py-10">
      <LearningHero />

      <section id="lessons" className="py-16">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            AI Learning Academy
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Visual lessons for enterprise AI
          </h2>

          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Learn how safe AI systems use retrieval, grounding, confidence,
            governance, testing and human approval before taking business action.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-card/90 p-8 backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Free to explore. Sign up later to save progress.
            </h2>

            <p className="mt-3 leading-7 text-muted-foreground">
              Public lessons stay open for recruiters, hiring managers and peers.
              Authentication can later unlock saved progress, quizzes, badges and
              advanced AI governance labs.
            </p>
          </div>

          <div className="rounded-2xl border bg-muted/50 p-5">
            <p className="font-semibold">Future signup features</p>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Save completed lessons</li>
              <li>• Unlock advanced governance labs</li>
              <li>• Take quizzes</li>
              <li>• Generate completion badges</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}