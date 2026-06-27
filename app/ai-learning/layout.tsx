import type { ReactNode } from 'react'
import { AnimatedBackground } from '@/components/ai-learning/AnimatedBackground'
import { LearningNavbar } from '@/components/ai-learning/LearningNavbar'
import { LearningFooter } from '@/components/ai-learning/LearningFooter'

export default function AILearningLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">

      <AnimatedBackground />

      <div className="relative z-10">

        <LearningNavbar />

        {children}

        <LearningFooter />

      </div>

    </div>
  )
}