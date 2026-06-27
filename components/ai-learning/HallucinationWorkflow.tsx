'use client'

import { motion } from 'motion/react'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

export function HallucinationWorkflow() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-3xl border border-red-300 bg-red-50 p-8"
      >
        <AlertTriangle className="mb-5 h-10 w-10 text-red-600" />

        <h2 className="text-2xl font-bold">
          Without Grounding
        </h2>

        <div className="mt-6 space-y-5">

          <div className="rounded-xl bg-white p-4 shadow">
            User Question
          </div>

          ↓

          <div className="rounded-xl bg-white p-4 shadow">
            AI guesses answer
          </div>

          ↓

          <div className="rounded-xl bg-red-200 p-4">
            ❌ Hallucination
          </div>

        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-3xl border border-green-300 bg-green-50 p-8"
      >
        <ShieldCheck className="mb-5 h-10 w-10 text-green-700" />

        <h2 className="text-2xl font-bold">
          With RAG
        </h2>

        <div className="mt-6 space-y-5">

          <div className="rounded-xl bg-white p-4 shadow">
            User Question
          </div>

          ↓

          <div className="rounded-xl bg-white p-4 shadow">
            Retrieve Documents
          </div>

          ↓

          <div className="rounded-xl bg-white p-4 shadow">
            Ground Answer
          </div>

          ↓

          <div className="rounded-xl bg-green-200 p-4">
            ✅ Trusted Response
          </div>

        </div>
      </motion.div>

    </div>
  )
}