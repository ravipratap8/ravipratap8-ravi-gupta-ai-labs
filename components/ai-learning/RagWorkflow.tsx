'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileSearch,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const workflowSteps = [
  {
    id: 1,
    title: 'User asks a question',
    description: 'The user asks something that needs accurate business context.',
    icon: MessageSquare,
    example: '“What is our refund policy for cancelled events?”',
  },
  {
    id: 2,
    title: 'Search trusted knowledge',
    description: 'The system searches approved documents, FAQs, policies and knowledge bases.',
    icon: FileSearch,
    example: 'Search policy documents and approved customer support content.',
  },
  {
    id: 3,
    title: 'Retrieve relevant context',
    description: 'Only the most relevant chunks are selected and passed to the AI model.',
    icon: Database,
    example: 'Retrieve refund rules, cancellation terms and exception notes.',
  },
  {
    id: 4,
    title: 'Generate grounded answer',
    description: 'The AI writes an answer using the retrieved context instead of guessing.',
    icon: BrainCircuit,
    example: 'Draft response with source-backed policy details.',
  },
  {
    id: 5,
    title: 'Check confidence and risk',
    description: 'The system estimates confidence and checks whether human review is needed.',
    icon: ShieldCheck,
    example: 'Low risk: auto-suggest. High risk: send for approval.',
  },
  {
    id: 6,
    title: 'Deliver approved response',
    description: 'The final response is shown with audit history and source traceability.',
    icon: CheckCircle2,
    example: 'Send approved answer and log the decision.',
  },
]

export function RagWorkflow() {
  const [activeStep, setActiveStep] = useState(1)

  const currentStep = useMemo(
    () => workflowSteps.find((step) => step.id === activeStep) ?? workflowSteps[0],
    [activeStep],
  )

  const CurrentIcon = currentStep.icon

  function nextStep() {
    setActiveStep((current) => (current === workflowSteps.length ? 1 : current + 1))
  }

  function previousStep() {
    setActiveStep((current) => (current === 1 ? workflowSteps.length : current - 1))
  }

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Badge className="mb-3 rounded-full">Interactive visual lesson</Badge>
          <h2 className="text-3xl font-bold tracking-tight">
            RAG: Retrieval-Augmented Generation
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            RAG helps AI answer using trusted information instead of relying only
            on model memory. This is one of the most important patterns for safe
            enterprise AI.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={previousStep}>
            Previous
          </Button>
          <Button onClick={nextStep}>Next step</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border bg-muted/30 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === activeStep
              const isCompleted = step.id < activeStep

              return (
                <motion.button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative rounded-3xl border p-5 text-left transition-all ${
                    isActive
                      ? 'border-primary bg-background shadow-lg'
                      : 'bg-background/70 hover:bg-background'
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-sm font-semibold text-muted-foreground">
                      Step {step.id}
                    </span>
                  </div>

                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>

                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="absolute -right-5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground xl:block" />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <CurrentIcon className="h-5 w-5" />
              </div>
              {currentStep.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border bg-muted/40 p-5"
            >
              <p className="text-sm font-medium text-muted-foreground">
                Business example
              </p>
              <p className="mt-2 text-base leading-7">{currentStep.example}</p>
            </motion.div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-semibold">Why this matters</p>
                  <p className="mt-2 text-sm leading-6">
                    Without retrieval and grounding, AI can sound confident even
                    when it is wrong. RAG reduces that risk by making the answer
                    depend on approved source material.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-5">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <p className="font-semibold">Plain English definition</p>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                RAG means the AI first retrieves relevant information, then uses
                that information to generate an answer. Think of it as giving AI
                the right business documents before asking it to respond.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}