import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

import { WorkflowEngine } from '@/components/ai-learning/WorkflowEngine'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { confidenceLesson } from '@/lib/ai-learning/confidence'

export const metadata = {
  title: 'Confidence Scoring | AI Learning',
  description:
    'Learn how enterprise AI systems estimate confidence before making decisions.',
}

export default function ConfidenceScoringPage() {
  return (
    <main className="container mx-auto max-w-7xl px-6 py-10">

      <Button
        asChild
        variant="ghost"
        className="mb-8"
      >
        <Link href="/ai-learning">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to AI Learning
        </Link>
      </Button>

      <Badge className="mb-4">
        Intermediate • 9 mins
      </Badge>

      <h1 className="text-5xl font-bold tracking-tight">
        {confidenceLesson.title}
      </h1>

      <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
        {confidenceLesson.subtitle}
      </p>

      <div className="mt-12">
        <WorkflowEngine
          title={confidenceLesson.title}
          subtitle={confidenceLesson.subtitle}
          steps={confidenceLesson.workflow}
        />
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-card p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Key Concepts
          </h2>

          <ul className="space-y-4">

            {confidenceLesson.keyPoints.map((point) => (

              <li
                key={point}
                className="flex items-start gap-3"
              >

                <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />

                <span>{point}</span>

              </li>

            ))}

          </ul>

        </div>

        <div className="rounded-3xl border bg-card p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Business Example
          </h2>

          <div className="rounded-2xl bg-muted p-6">

            <h3 className="font-semibold">
              {confidenceLesson.businessExample.title}
            </h3>

            <p className="mt-4 leading-7 text-muted-foreground">
              {confidenceLesson.businessExample.description}
            </p>

          </div>

        </div>

      </div>

    </main>
  )
}