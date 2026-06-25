'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/nav'
import { EventOps } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import VoiceCopilot from '@/components/voice/VoiceCopilot'
import ThemeToggle from '@/components/dashboard/theme-toggle'
import {
  LayoutDashboard, CalendarDays, MessagesSquare, ShieldCheck, Sparkles,
  Users, ScrollText, Settings, Menu, Bell, ArrowUpRight, Cpu,
} from 'lucide-react'

const ICONS = { LayoutDashboard, CalendarDays, MessagesSquare, ShieldCheck, Sparkles, Users, ScrollText, Settings }

function NavLinks({ counts, onNavigate }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon] || LayoutDashboard
        const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
        const badge = item.badgeKey ? counts?.[item.badgeKey] : null
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              active ? 'bg-sidebar-accent text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white'
            )}
          >
            <Icon className={cn('h-[18px] w-[18px]', active ? 'text-cyan-400' : 'text-sidebar-foreground group-hover:text-cyan-400')} />
            <span className="flex-1">{item.label}</span>
            {badge ? <span className="rounded-full bg-cyan-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">{badge}</span> : null}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarInner({ counts, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-sm font-bold text-slate-950">RG</span>
        <div className="leading-tight"><p className="font-display text-sm font-bold text-white">EventOps</p><p className="text-[11px] text-cyan-400">AI Assistant</p></div>
      </Link>
      <div className="mt-2 flex-1 overflow-y-auto scrollbar-thin">
        <NavLinks counts={counts} onNavigate={onNavigate} />
      </div>
      <div className="m-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4">
        <div className="flex items-center gap-2 text-cyan-400"><Cpu className="h-4 w-4" /><span className="text-xs font-semibold">MCP-ready</span></div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-sidebar-foreground">Core actions exposed as typed AI-agent tools.</p>
        <Link href="/dashboard/settings" className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:underline">View tools <ArrowUpRight className="h-3 w-3" /></Link>
      </div>
    </div>
  )
}

export default function DashboardShell({ children }) {
  const [counts, setCounts] = useState({})
  const [open, setOpen] = useState(false)

  useEffect(() => {
    EventOps.stats()
      .then((s) => setCounts({ inbox: s.newEnquiries, approvals: s.pendingApprovals }))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border md:block">
        <SidebarInner counts={counts} />
      </aside>

      <div className="md:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-0 p-0">
              <SidebarInner counts={counts} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <p className="font-display text-sm font-semibold text-foreground">AI EventOps Assistant</p>
            <p className="text-xs text-muted-foreground">Demo workspace • mock data</p>
          </div>
          <ThemeToggle />
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {counts.approvals ? <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">{counts.approvals}</span> : null}
          </Button>
          <div className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3">
            <img src="https://customer-assets.emergentagent.com/job_79f6bd31-046c-4b35-871f-1a3b2a3031ac/artifacts/l4ogjdym_Ravi%20Gupta%20Profile%20Picture.jpeg" alt="Ravi" className="h-7 w-7 rounded-full object-cover" />
            <div className="hidden text-left leading-tight sm:block"><p className="text-xs font-semibold text-foreground">Ravi Gupta</p><p className="text-[10px] text-muted-foreground">Organiser</p></div>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
      <VoiceCopilot />
    </div>
  )
}
