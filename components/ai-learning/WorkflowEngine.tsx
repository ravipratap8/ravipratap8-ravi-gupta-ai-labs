'use client'

import { motion } from 'motion/react'
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Gauge,
  MessageSquare,
  Search,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface WorkflowStep {
  title: string
  description: string
  icon: string
  color?: string
}

interface WorkflowEngineProps {
  title: string
  subtitle?: string
  steps: WorkflowStep[]
}

const iconMap = {
  MessageSquare,
  Search,
  Database,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  AlertTriangle,
  UserCheck,
  ClipboardCheck,
}

export function WorkflowEngine({
  title,
  subtitle,
  steps,
}: WorkflowEngineProps) {
  return (
    <section className="rounded-3xl border bg-card p-8">

      <div className="mb-10">

        <Badge className="mb-4">
          Interactive Workflow
        </Badge>

        <h2 className="text-3xl font-bold">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-4 max-w-3xl text-muted-foreground leading-7">
            {subtitle}
          </p>
        )}

      </div>

      <div className="grid gap-6 lg:grid-cols-6">

        {steps.map((step, index) => {

          const Icon =
            iconMap[step.icon as keyof typeof iconMap] ?? BrainCircuit

          return (

            <motion.div
              key={step.title}
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.12,
              }}
              className="relative"
            >

              <Card className="h-full rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                <CardContent className="p-6">

                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      step.color ?? 'bg-primary/10'
                    }`}
                  >

                    <Icon className="h-7 w-7 text-primary" />

                  </div>

                  <h3 className="font-semibold leading-6">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>

                </CardContent>

              </Card>

              {index < steps.length - 1 && (
                <ArrowRight
                  className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-muted-foreground xl:block"
                />
              )}

            </motion.div>

          )
        })}

      </div>

    </section>
  )
}