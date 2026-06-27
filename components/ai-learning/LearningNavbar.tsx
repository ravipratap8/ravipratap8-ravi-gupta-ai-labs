'use client'

import Link from 'next/link'
import { BrainCircuit } from 'lucide-react'

const links = [
  {
    name: 'Overview',
    href: '/ai-learning',
  },
  {
    name: 'RAG',
    href: '/ai-learning/rag',
  },
  {
    name: 'Governance',
    href: '/ai-learning/ai-governance',
  },
  {
    name: 'Testing',
    href: '/ai-learning/ai-testing',
  },
  {
    name: 'MCP',
    href: '/ai-learning/mcp',
  },
]

export function LearningNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/ai-learning" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <span className="font-bold tracking-tight">
            AI Learning
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}