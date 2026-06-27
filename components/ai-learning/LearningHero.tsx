'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LearningHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-slate-950 px-6 py-16 text-white shadow-2xl sm:px-10 lg:px-14">
      <div className="absolute inset-0">
        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur"
          >
            <Sparkles className="h-4 w-4" />
            Enterprise AI concepts, explained visually
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Learn how safe AI systems actually work.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            Explore RAG, hallucination control, prompt quality, confidence
            scoring, human approval, AI testing and MCP through animated
            enterprise workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="rounded-full">
              <Link href="/ai-learning/rag">
                Start with RAG
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/ai-learning#lessons">View all lessons</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="relative"
        >
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">AI Safety Pipeline</p>
                <h2 className="text-xl font-semibold">Enterprise Workflow</h2>
              </div>

              <ShieldCheck className="h-7 w-7 text-emerald-300" />
            </div>

            <div className="space-y-3">
              {[
                'Business request',
                'Retrieve trusted context',
                'Generate grounded answer',
                'Score confidence',
                'Assess risk',
                'Human approval if needed',
              ].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.25 + index * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                    {index + 1}
                  </div>

                  <span className="text-sm text-slate-100">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-3 -top-5 hidden rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur sm:block"
          >
            <BrainCircuit className="h-8 w-8 text-blue-300" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}