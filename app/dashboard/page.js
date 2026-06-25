'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EventOps } from '@/lib/api-client'
import { PageHeader, StatCard, Loading, RiskBadge } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CalendarDays, ShieldCheck, MessagesSquare, Flame, Sparkles, Plus,
  Activity, CheckCircle2, AlertTriangle, ArrowRight, Bot, Inbox,
} from 'lucide-react'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function DashboardHome() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    EventOps.stats().then(setStats).catch(() => {})
  }, [])

  if (!stats) return <Loading label="Loading dashboard…" />

  const quickActions = [
    { label: 'Create event', href: '/dashboard/events/new', icon: Plus },
    { label: 'Review approvals', href: '/dashboard/approvals', icon: ShieldCheck },
    { label: 'Generate content', href: '/dashboard/ai-content', icon: Sparkles },
    { label: 'Open AI inbox', href: '/dashboard/inbox', icon: MessagesSquare },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back, Ravi — here is your event operations overview.">
        <Link href="/dashboard/events/new"><Button className="bg-cyan-500 hover:bg-cyan-600"><Plus className="mr-1.5 h-4 w-4" /> New event</Button></Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={CalendarDays} label="Total events" value={stats.totalEvents} hint={`${stats.publishedEvents} published`} accent="cyan" />
        <StatCard icon={ShieldCheck} label="Pending approvals" value={stats.pendingApprovals} hint="Awaiting review" accent="amber" />
        <StatCard icon={MessagesSquare} label="New enquiries" value={stats.newEnquiries} hint="AI drafts ready" accent="violet" />
        <StatCard icon={Flame} label="Hot leads" value={stats.hotLeads} hint={`${stats.totalLeads} total leads`} accent="rose" />
        <StatCard icon={Sparkles} label="Content generated" value={stats.contentGenerated} hint="AI assets" accent="emerald" />
        <StatCard icon={Bot} label="AI safety" value={stats.aiSafety.status === 'All clear' ? 'OK' : 'Review'} hint={`${stats.aiSafety.highRiskQueued} high-risk queued`} accent={stats.aiSafety.highRiskQueued ? 'rose' : 'emerald'} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-cyan-500" /><h2 className="font-display text-lg font-semibold">Recent activity</h2></div>
          <div className="space-y-1">
            {stats.recentActivity?.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-muted">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  {a.action.includes('approved') ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : a.riskLevel === 'High' ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : <Bot className="h-4 w-4 text-cyan-500" />}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{a.detail}</p>
                  <p className="text-xs text-muted-foreground">{a.actor} • {timeAgo(a.createdAt)} • <span className="font-mono">{a.action}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              {quickActions.map((q) => (
                <Link key={q.href} href={q.href} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-sm font-medium text-foreground/90 transition hover:border-cyan-300 hover:bg-cyan-50">
                  <q.icon className="h-4 w-4 text-cyan-500" /> {q.label} <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-center gap-2 text-cyan-400"><ShieldCheck className="h-5 w-5" /><h2 className="font-display text-lg font-semibold text-white">AI Safety status</h2></div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-slate-300">Human-in-the-loop</span><Badge className="border-0 bg-emerald-500/20 text-emerald-300">Enforced</Badge></div>
              <div className="flex items-center justify-between"><span className="text-slate-300">Auto-send</span><Badge className="border-0 bg-rose-500/20 text-rose-300">Disabled</Badge></div>
              <div className="flex items-center justify-between"><span className="text-slate-300">High-risk queued</span><RiskBadge level="High" /></div>
            </div>
            <Link href="/dashboard/governance"><Button variant="secondary" className="mt-5 w-full bg-white/10 text-white hover:bg-white/20">View AI governance <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
