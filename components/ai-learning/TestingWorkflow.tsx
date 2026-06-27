'use client'

import { motion } from 'motion/react'
import {
  CheckCircle2,
  Bug,
  ShieldCheck,
  FlaskConical,
  BrainCircuit,
} from 'lucide-react'

const stages = [
  {
    title: 'Prompt Validation',
    description: 'Verify prompts produce expected outputs.',
    icon: BrainCircuit,
  },
  {
    title: 'Hallucination Testing',
    description: 'Detect fabricated answers.',
    icon: Bug,
  },
  {
    title: 'Risk Assessment',
    description: 'Validate confidence and governance.',
    icon: ShieldCheck,
  },
  {
    title: 'Regression Testing',
    description: "Ensure prompt changes don't break behaviour.",
    icon: FlaskConical,
  },
  {
    title: 'Production Ready',
    description: 'AI workflow approved.',
    icon: CheckCircle2,
  },
]

export function TestingWorkflow() {
  return (
    <section className="rounded-3xl border bg-background p-8">

      <div className="mb-10">
        <h2 className="text-3xl font-bold">
          AI Testing Lifecycle
        </h2>

        <p className="mt-3 max-w-3xl text-muted-foreground">
          Enterprise AI systems require far more than unit testing.
          Every prompt, workflow and model output must be validated.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">

        {stages.map((stage, index) => {

          const Icon = stage.icon

          return (

            <motion.div
              key={stage.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.15,
              }}
              viewport={{
                once: true,
              }}
              className="rounded-3xl border bg-card p-6 shadow-sm"
            >

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">

                <Icon className="h-7 w-7 text-primary" />

              </div>

              <h3 className="font-semibold">
                {stage.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {stage.description}
              </p>

            </motion.div>

          )
        })}

      </div>

    </section>
  )
}