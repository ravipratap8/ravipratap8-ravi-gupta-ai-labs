'use client'

import { motion } from 'motion/react'

const nodes = [
  { top: '8%', left: '10%', size: 18 },
  { top: '22%', left: '72%', size: 14 },
  { top: '38%', left: '30%', size: 22 },
  { top: '58%', left: '82%', size: 18 },
  { top: '76%', left: '14%', size: 16 },
  { top: '84%', left: '56%', size: 20 },
  { top: '18%', left: '46%', size: 12 },
  { top: '68%', left: '42%', size: 14 },
]

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5"
      />

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 180,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [.25, .45, .25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      {nodes.map((node, index) => (

        <motion.div
          key={index}
          animate={{
            y: [0, -20, 0],
            opacity: [.5, 1, .5],
          }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
          }}
          className="absolute rounded-full bg-primary shadow-lg shadow-primary/40"
          style={{
            top: node.top,
            left: node.left,
            width: node.size,
            height: node.size,
          }}
        />

      ))}

    </div>
  )
}