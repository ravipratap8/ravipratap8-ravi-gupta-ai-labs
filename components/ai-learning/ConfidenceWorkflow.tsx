'use client'

import { motion } from 'motion/react'

export function ConfidenceWorkflow() {
  return (
    <div className="rounded-3xl border p-10">

      <h2 className="mb-8 text-3xl font-bold">
        AI Confidence Meter
      </h2>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '92%' }}
        transition={{ duration: 2 }}
        className="h-10 rounded-full bg-green-500"
      />

      <div className="mt-5 flex justify-between">
        <span>0%</span>
        <span className="font-bold text-green-700">
          92%
        </span>
        <span>100%</span>
      </div>

      <div className="mt-10 rounded-2xl bg-green-50 p-6">

        Confidence above 90% generally indicates the AI found strong supporting evidence.

      </div>

    </div>
  )
}