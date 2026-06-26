'use client'

import Link from 'next/link'
import { PageHeader, StatCard, RiskBadge } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CalendarDays, ShieldCheck, MessagesSquare, Flame, Sparkles, Plus,
  Activity, CheckCircle2, AlertTriangle, ArrowRight, Bot,
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

const stats = {
  totalEvents: 3,
  publishedEvents: 2,
  pendingApprovals: 6,
  newEnquiries: 8,
  hotLeads: 4,
  totalLeads: 12,
  contentGenerated: 18,
  aiGovernance: {
    status: 'Controlled',
    highRiskQueued: 1,
  },
  recentActivity: [
    {
      id: '1',
      action: 'ai_reply_drafted',
      detail: 'AI drafted a response for a high-risk attendee enquiry and queued it for human review.',
      actor: 'AI EventOps Assistant',
      riskLevel: 'High',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: '2',
      action: 'lead_classified',
      detail: 'A sponsorship enquiry was classified as a priority lead with medium confidence.',
      actor: 'AI EventOps Assistant',
      riskLevel: 'Medium',
      createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    },
    {
      id: '3',
      action: 'content_draft_created',
      detail: 'Social post and reel script drafts were generated for a sample event campaign.',
      actor: 'Demo Workspace',
      riskLevel: 'Low',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],
}

export default function DashboardHome() {
  const quickActions = [
    { label: 'Create sample event', href: '/dashboard/events/new', icon: Plus },
    { label: 'Review AI approvals', href: '/dashboard/approvals', icon: ShieldCheck },
    { label: 'Generate content draft', href: '/dashboard/ai-content', icon: Sparkles },
    { label: 'Open AI inbox', href: '/dashboard/inbox', icon: MessagesSquare },
  ]

  return (
    <div>
      <PageHeader title="AI EventOps Dashboard" subtitle="Portfolio demo workspace showing governed AI workflows for event operations.">
        <Link href="/dashboard/events/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600">
            <Plus className="mr-1.5 h-4 w-4" /> New sample event
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />
          <div>
            <p className="font-semibold text-slate-900">Independent portfolio demo</p>
            <p className="mt-1">
              This workspace uses sample data to demonstrate AI-drafted responses, confidence scoring,
              risk assessment, human approval, and auditability. No employer data or production customer
              data is used here.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={CalendarDays} label="Sample events" value={stats.totalEvents} hint={`${stats.publishedEvents} published`} accent="cyan" />
        <StatCard icon={ShieldCheck} label="Pending reviews" value={stats.pendingApprovals} hint="Human approval required" accent="amber" />
        <StatCard icon={MessagesSquare} label="New enquiries" value={stats.newEnquiries} hint="AI drafts ready" accent="violet" />
        <StatCard icon={Flame} label="Priority leads" value={stats.hotLeads} hint={`${stats.totalLeads} total leads`} accent="rose" />
        <StatCard icon={Sparkles} label="Content drafts" value={stats.contentGenerated} hint="Generated for review" accent="emerald" />
        <StatCard icon={Bot} label="AI governance" value="OK" hint={`${stats.aiGovernance.highRiskQueued} high-risk queued`} accent="emerald" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-500" />
            <h2 className="font-display text-lg font-semibold">Recent demo activity</h2>
          </div>

          <div className="space-y-1">
            {stats.recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-muted">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  {a.action.includes('approved') ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : a.riskLevel === 'High' ? (
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  ) : (
                    <Bot className="h-4 w-4 text-cyan-500" />
                  )}
                </span>

                <div className="flex-1">
                  <p className="text-sm text-foreground">{a.detail}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.actor} • {timeAgo(a.createdAt)} • <span className="font-mono">{a.action}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Quick actions</h2>

            <div className="mt-4 grid gap-2">
              {quickActions.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-sm font-medium text-foreground/90 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  <q.icon className="h-4 w-4 text-cyan-500" />
                  {q.label}
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-center gap-2 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="font-display text-lg font-semibold text-white">AI governance status</h2>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Human-in-the-loop</span>
                <Badge className="border-0 bg-emerald-500/20 text-emerald-300">Enforced</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Auto-send</span>
                <Badge className="border-0 bg-rose-500/20 text-rose-300">Disabled</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">High-risk items</span>
                <RiskBadge level="High" />
              </div>
            </div>

            <Link href="/dashboard/governance">
              <Button variant="secondary" className="mt-5 w-full bg-white/10 text-white hover:bg-white/20">
                View AI governance <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
