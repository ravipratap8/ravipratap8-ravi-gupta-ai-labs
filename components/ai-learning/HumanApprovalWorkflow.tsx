'use client'

import { motion } from 'motion/react'

export function HumanApprovalWorkflow() {
  return (
    <div className="grid gap-6 md:grid-cols-4">

      {[
        'AI Draft',
        'Manager Review',
        'Approved',
        'Customer Receives Response',
      ].map((step, index) => (
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: index * 0.3,
          }}
          className="rounded-3xl border p-8 text-center shadow-sm"
        >
          <h2 className="font-semibold">
            {step}
          </h2>
        </motion.div>
      ))}

    </div>
  )
}