import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

import { WorkflowEngine } from '@/components/ai-learning/WorkflowEngine'
import { Quiz } from '@/components/ai-learning/Quiz'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { llmLesson } from '@/lib/ai-learning/llm'

export const metadata = {
  title: 'Large Language Models | AI Learning',
  description:
    'Learn how Large Language Models like ChatGPT work through an interactive visual workflow.',
}

export default function LargeLanguageModelsPage() {
  return (
    <main className="container mx-auto max-w-7xl px-6 py-10">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/ai-learning">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to AI Learning
        </Link>
      </Button>

      <Badge className="mb-4">Beginner • 12 mins</Badge>

      <h1 className="text-5xl font-bold tracking-tight">{llmLesson.title}</h1>

      <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
        {llmLesson.subtitle}
      </p>

      <div className="mt-12">
        <WorkflowEngine
          title={llmLesson.title}
          subtitle={llmLesson.subtitle}
          steps={llmLesson.workflow}
        />
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold">Key Concepts</h2>

          <ul className="space-y-4">
            {llmLesson.keyPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold">Real World Example</h2>

          <div className="rounded-2xl bg-muted p-6">
            <h3 className="font-semibold">
              {llmLesson.businessExample.title}
            </h3>

            <p className="mt-4 leading-7 text-muted-foreground">
              {llmLesson.businessExample.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Quiz questions={llmLesson.quiz} />
      </div>
    </main>
  )
}