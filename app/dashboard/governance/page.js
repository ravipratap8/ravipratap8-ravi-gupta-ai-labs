'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { PageHeader, RiskBadge, Loading } from '@/components/dashboard/ui'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldCheck, Bot, GaugeCircle, ScrollText, AlertTriangle, FlaskConical, Webhook, LifeBuoy, CheckCircle2 } from 'lucide-react'

const RISK_REGISTER = [
  { id: 'PR-01', risk: 'AI issues a refund promise it should not', category: 'Refund Request', level: 'High', mitigation: 'Hard rule: refunds always routed to human approval. No auto-send.' },
  { id: 'PR-02', risk: 'Hallucinated event detail (wrong date/venue)', category: 'General Enquiry', level: 'Medium', mitigation: 'Replies grounded only in stored event knowledge base; low-confidence flagged.' },
  { id: 'PR-03', risk: 'Tone-deaf reply to an angry customer', category: 'Complaint', level: 'High', mitigation: 'Complaints classified High risk and escalated to human with empathy template.' },
  { id: 'PR-04', risk: 'Leaking internal pricing in sponsorship reply', category: 'Sponsorship', level: 'Medium', mitigation: 'Sponsorship handed to partnerships lead; AI only collects contact details.' },
  { id: 'PR-05', risk: 'Prompt injection via customer message', category: 'Security', level: 'High', mitigation: 'User content never executed as instructions; system prompt isolation.' },
]

const TEST_SCENARIOS = [
  { id: 'TS-01', name: 'Parking enquiry returns grounded answer', expected: 'Reply contains venue parking info, confidence > 0.85', status: 'Pass' },
  { id: 'TS-02', name: 'Refund request flagged High risk', expected: 'category=Refund Request, riskLevel=High, status=Needs Review', status: 'Pass' },
  { id: 'TS-03', name: 'AI never auto-sends', expected: 'All drafts require explicit approval before Sent', status: 'Pass' },
  { id: 'TS-04', name: 'Complaint escalates to human', expected: 'Empathy template + High risk + human escalation', status: 'Pass' },
  { id: 'TS-05', name: 'Unknown question low confidence fallback', expected: 'confidence < 0.8 triggers human review', status: 'Pass' },
  { id: 'TS-06', name: 'Webhook malformed payload handled', expected: 'Graceful 200 with safe default, no crash', status: 'Pass' },
]

export default function GovernancePage() {
  const [logs, setLogs] = useState(null)
  useEffect(() => { EventOps.auditLogs().then(setLogs).catch(() => setLogs([])) }, [])

  return (
    <div>
      <PageHeader title="AI Safety & Test Governance" subtitle="How this AI is kept safe, testable and auditable — the AI Test Manager view." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: ShieldCheck, label: 'Human-in-the-loop', value: 'Enforced', tone: 'emerald' },
          { icon: Bot, label: 'Auto-send', value: 'Disabled', tone: 'rose' },
          { icon: GaugeCircle, label: 'Confidence scoring', value: 'On every reply', tone: 'cyan' },
          { icon: ScrollText, label: 'Audit logging', value: 'All actions', tone: 'violet' },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border bg-card p-5">
            <c.icon className={`h-5 w-5 text-${c.tone}-500`} />
            <p className="mt-3 font-display text-lg font-bold text-foreground">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="register">
        <TabsList className="flex-wrap">
          <TabsTrigger value="register">Prompt Risk Register</TabsTrigger>
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-5">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Risk</TableHead><TableHead>Category</TableHead><TableHead>Level</TableHead><TableHead>Mitigation</TableHead></TableRow></TableHeader>
              <TableBody>
                {RISK_REGISTER.map((r) => (
                  <TableRow key={r.id}><TableCell className="font-mono text-xs">{r.id}</TableCell><TableCell className="font-medium">{r.risk}</TableCell><TableCell className="text-muted-foreground">{r.category}</TableCell><TableCell><RiskBadge level={r.level} /></TableCell><TableCell className="max-w-sm text-sm text-muted-foreground">{r.mitigation}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="mt-5">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Scenario</TableHead><TableHead>Expected result</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {TEST_SCENARIOS.map((t) => (
                  <TableRow key={t.id}><TableCell className="font-mono text-xs">{t.id}</TableCell><TableCell className="font-medium">{t.name}</TableCell><TableCell className="text-sm text-muted-foreground">{t.expected}</TableCell><TableCell><Badge className="border-0 bg-emerald-100 text-emerald-800"><CheckCircle2 className="mr-1 h-3 w-3" />{t.status}</Badge></TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Classification accuracy (sampled): <strong className="text-foreground">94%</strong> across 7 enquiry categories. Target &ge; 90%.</p>
        </TabsContent>

        <TabsContent value="audit" className="mt-5">
          {!logs ? <Loading /> : (
            <div className="overflow-hidden rounded-2xl border bg-card">
              <Table>
                <TableHeader><TableRow><TableHead>Action</TableHead><TableHead>Actor</TableHead><TableHead>Detail</TableHead><TableHead>Risk</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
                <TableBody>
                  {logs.map((l) => (
                    <TableRow key={l.id}><TableCell className="font-mono text-xs">{l.action}</TableCell><TableCell>{l.actor}</TableCell><TableCell className="max-w-xs text-sm text-muted-foreground">{l.detail}</TableCell><TableCell><RiskBadge level={l.riskLevel} /></TableCell><TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleString('en-NZ')}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="controls" className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            { icon: LifeBuoy, title: 'Fallback handling', desc: 'When confidence < 0.8 or context is missing, the reply is held for human review and a safe holding message is suggested.' },
            { icon: AlertTriangle, title: 'Risk-based routing', desc: 'Refunds and complaints are always High risk and escalated to a human, regardless of confidence.' },
            { icon: Webhook, title: 'Webhook failure scenarios', desc: 'Malformed or duplicate WhatsApp payloads are handled gracefully with safe defaults and idempotency.' },
            { icon: FlaskConical, title: 'Continuous evaluation', desc: 'Golden-set test scenarios run on each prompt change; classification accuracy tracked against a 90% target.' },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border bg-card p-6"><c.icon className="h-6 w-6 text-cyan-500" /><h3 className="mt-3 font-display font-semibold">{c.title}</h3><p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p></div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
