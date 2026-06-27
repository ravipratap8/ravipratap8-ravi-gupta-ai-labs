'use client'

import { motion } from 'motion/react'
import {
  BrainCircuit,
  ShieldCheck,
  BadgeCheck,
  ClipboardCheck,
  UserCheck,
} from 'lucide-react'

const steps = [
  {
    icon: BrainCircuit,
    title: 'AI generates draft',
    color: 'bg-blue-100',
  },
  {
    icon: BadgeCheck,
    title: 'Confidence Score',
    color: 'bg-yellow-100',
  },
  {
    icon: ShieldCheck,
    title: 'Risk Assessment',
    color: 'bg-orange-100',
  },
  {
    icon: UserCheck,
    title: 'Human Approval',
    color: 'bg-green-100',
  },
  {
    icon: ClipboardCheck,
    title: 'Audit Log',
    color: 'bg-purple-100',
  },
]

export function GovernanceWorkflow() {
  return (
    <div className="rounded-3xl border p-8">

      <h2 className="mb-10 text-3xl font-bold">
        Enterprise AI Workflow
      </h2>

      <div className="grid gap-6 md:grid-cols-5">

        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
              }}
              className="text-center"
            >
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${step.color}`}
              >
                <Icon className="h-10 w-10" />
              </div>

              <h3 className="mt-5 font-semibold">
                {step.title}
              </h3>
            </motion.div>
          )
        })}

      </div>

    </div>
  )
}