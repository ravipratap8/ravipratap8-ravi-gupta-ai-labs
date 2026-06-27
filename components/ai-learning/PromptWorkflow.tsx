'use client'

import { motion } from 'motion/react'

export function PromptWorkflow() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-3xl border bg-red-50 p-8"
      >
        <h2 className="text-2xl font-bold">
          Poor Prompt
        </h2>

        <div className="mt-6 rounded-xl bg-white p-5 shadow">

What happened?

        </div>

        <div className="mt-6 rounded-xl bg-red-200 p-5">

Generic AI response...

        </div>

      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="rounded-3xl border bg-green-50 p-8"
      >
        <h2 className="text-2xl font-bold">
          Better Prompt
        </h2>

        <div className="mt-6 rounded-xl bg-white p-5 shadow">

Summarise the refund policy in under 100 words using only the supplied document.

        </div>

        <div className="mt-6 rounded-xl bg-green-200 p-5">

Accurate grounded response

        </div>

      </motion.div>

    </div>
  )
}