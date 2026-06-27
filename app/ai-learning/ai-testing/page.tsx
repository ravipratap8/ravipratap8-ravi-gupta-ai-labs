import { Badge } from '@/components/ui/badge'
import { TestingWorkflow } from '@/components/ai-learning/TestingWorkflow'

export const metadata = {
  title: 'AI Testing | AI Learning',
  description:
    'Learn how enterprise AI systems are tested before deployment.',
}

export default function AITestingPage() {
  return (
    <main className="container mx-auto max-w-7xl px-6 py-10">

      <Badge className="mb-4">
        Advanced · 18 mins
      </Badge>

      <h1 className="text-5xl font-bold tracking-tight">
        Testing Enterprise AI Systems
      </h1>

      <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
        Modern AI applications require prompt validation,
        hallucination detection, regression testing,
        governance validation and human approval before
        production deployment.
      </p>

      <div className="mt-12">
        <TestingWorkflow />
      </div>

    </main>
  )
}