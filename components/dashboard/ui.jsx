'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Loader2, Inbox } from 'lucide-react'

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, hint, accent = 'cyan' }) {
  const accents = {
    cyan: 'bg-cyan-50 text-cyan-600',
    violet: 'bg-violet-50 text-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-muted text-muted-foreground',
  }
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className={cn('grid h-10 w-10 place-items-center rounded-xl', accents[accent])}>
          {Icon && <Icon className="h-5 w-5" />}
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  )
}

const STATUS_STYLES = {
  Draft: 'bg-muted text-foreground/90 border-border',
  'Needs Review': 'bg-amber-100 text-amber-800 border-amber-200',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Sent: 'bg-blue-100 text-blue-800 border-blue-200',
  Published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Completed: 'bg-muted text-muted-foreground border-border',
}

export function StatusBadge({ status }) {
  return <Badge variant="outline" className={cn('border font-medium', STATUS_STYLES[status] || 'bg-muted text-foreground/90')}>{status}</Badge>
}

const RISK_STYLES = {
  Low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Medium: 'bg-amber-100 text-amber-800 border-amber-200',
  High: 'bg-rose-100 text-rose-800 border-rose-200',
}

export function RiskBadge({ level }) {
  return <Badge variant="outline" className={cn('border font-medium', RISK_STYLES[level] || 'bg-muted')}>{level} risk</Badge>
}

export function CategoryBadge({ category }) {
  const hot = category === 'Hot Lead'
  const comp = category === 'Complaint' || category === 'Refund Request'
  return (
    <Badge variant="outline" className={cn('border font-medium', hot ? 'bg-rose-50 text-rose-700 border-rose-200' : comp ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-cyan-50 text-cyan-700 border-cyan-200')}>
      {category}
    </Badge>
  )
}

export function Confidence({ value }) {
  const pct = Math.round((value || 0) * 100)
  const color = pct >= 88 ? 'bg-emerald-500' : pct >= 78 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
    </div>
  )
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" /> {label}
    </div>
  )
}

export function EmptyState({ icon: Icon = Inbox, title, desc, children }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed bg-card py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-slate-400"><Icon className="h-7 w-7" /></span>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
      {desc && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{desc}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
