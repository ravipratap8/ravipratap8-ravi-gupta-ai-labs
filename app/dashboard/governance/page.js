'use client'

import { useEffect, useState } from 'react'
import { EventOps } from '@/lib/api-client'
import { PageHeader, RiskBadge, Loading } from '@/components/dashboard/ui'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ShieldCheck, Bot, GaugeCircle, ScrollText, AlertTriangle,
  FlaskConical, Webhook, LifeBuoy, CheckCircle2,
} from 'lucide-react'

const RISK_REGISTER = [
  {
    id: 'PR-01',
    risk: 'AI drafts a refund or policy commitment without enough authority',
    category: 'Refund Request',
    level: 'High',
    mitigation: 'Refund and policy-sensitive enquiries are always routed to human approval. Auto-send remains disabled.',
  },
  {
    id: 'PR-02',
    risk: 'AI includes incorrect event details such as date, venue, or ticket conditions',
    category: 'General Enquiry',
    level: 'Medium',
    mitigation: 'Drafts are grounded in stored event context. Low-confidence responses are flagged for review.',
  },
  {
    id: 'PR-03',
    risk: 'AI drafts an insensitive response to an angry or disappointed attendee',
    category: 'Complaint',
    level: 'High',
    mitigation: 'Complaints are classified as high risk and routed to human review with an empathy-first draft.',
  },
  {
    id: 'PR-04',
    risk: 'AI shares commercial information before qualification',
    category: 'Sponsorship',
    level: 'Medium',
    mitigation: 'Sponsorship enquiries are classified as leads. AI only captures intent and contact details.',
  },
  {
    id: 'PR-05',
    risk: 'Prompt injection appears inside an incoming message',
    category: 'Security',
    level: 'High',
    mitigation: 'Incoming user content is treated as data, not as system instructions. Risky prompts are held for review.',
  },
]

const TEST_SCENARIOS = [
  {
    id: 'TS-01',
    name: 'Parking enquiry returns a grounded answer',
    expected: 'Draft uses stored event context and confidence is above the approval threshold.',
    status: 'Pass',
  },
  {
    id: 'TS-02',
    name: 'Refund request is flagged as high risk',
    expected: 'category=Refund Request, riskLevel=High, status=Needs Review.',
    status: 'Pass',
  },
  {
    id: 'TS-03',
    name: 'AI never auto-sends',
    expected: 'All AI-generated drafts require explicit human approval before follow-up.',
    status: 'Pass',
  },
  {
    id: 'TS-04',
    name: 'Complaint escalates to human review',
    expected: 'Empathy-led draft, high-risk classification, and human approval required.',
    status: 'Pass',
  },
  {
    id: 'TS-05',
    name: 'Unknown question uses safe fallback',
    expected: 'Low confidence triggers human review instead of a guessed answer.',
    status: 'Pass',
  },
  {
    id: 'TS-06',
    name: 'Malformed external payload is handled safely',
    expected: 'Request is handled gracefully with safe defaults and no workflow failure.',
    status: 'Pass',
  },
]

const GOVERNANCE_CARDS = [
  {
    icon: ShieldCheck,
    label: 'Human-in-the-loop',
    value: 'Enforced',
    toneClass: 'text-emerald-500',
  },
  {
    icon: Bot,
    label: 'Auto-send',
    value: 'Disabled',
    toneClass: 'text-rose-500',
  },
  {
    icon: GaugeCircle,
    label: 'Confidence scoring',
    value: 'Every draft',
    toneClass: 'text-cyan-500',
  },
  {
    icon: ScrollText,
    label: 'Audit logging',
    value: 'All actions',
    toneClass: 'text-violet-500',
  },
]

const CONTROLS = [
  {
    icon: LifeBuoy,
    title: 'Fallback handling',
    desc: 'When confidence is low or context is missing, the response is held for human review and a safe holding draft is suggested.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk-based routing',
    desc: 'Refunds, complaints, and policy-sensitive questions are routed as high risk and require human approval.',
  },
  {
    icon: Webhook,
    title: 'External payload handling',
    desc: 'Malformed or duplicate external messaging payloads are handled with safe defaults and idempotency controls.',
  },
  {
    icon: FlaskConical,
    title: 'Continuous evaluation',
    desc: 'Golden-set test scenarios are intended to run when prompts or classification rules change.',
  },
]

export default function GovernancePage() {
  const [logs, setLogs] = useState(null)

  useEffect(() => {
    EventOps.auditLogs().then(setLogs).catch(() => setLogs([]))
  }, [])

  return (
    <div>
      <PageHeader
        title="AI Governance and Test Controls"
        subtitle="A portfolio view of how AI workflows can be made safer, testable, explainable, and auditable."
      />

      <div className="mb-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            This page uses sample risks, controls, and audit events to demonstrate AI governance thinking.
            It does not display employer data, customer data, or production operational logs.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GOVERNANCE_CARDS.map((card) => (
          <div key={card.label} className="rounded-2xl border bg-card p-5">
            <card.icon className={`h-5 w-5 ${card.toneClass}`} />
            <p className="mt-3 font-display text-lg font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="register">
        <TabsList className="flex-wrap">
          <TabsTrigger value="register">Risk Register</TabsTrigger>
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-5">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Mitigation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RISK_REGISTER.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="font-mono text-xs">{risk.id}</TableCell>
                    <TableCell className="font-medium">{risk.risk}</TableCell>
                    <TableCell className="text-muted-foreground">{risk.category}</TableCell>
                    <TableCell><RiskBadge level={risk.level} /></TableCell>
                    <TableCell className="max-w-sm text-sm text-muted-foreground">{risk.mitigation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="mt-5">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Expected result</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TEST_SCENARIOS.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-mono text-xs">{test.id}</TableCell>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{test.expected}</TableCell>
                    <TableCell>
                      <Badge className="border-0 bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> {test.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Demo target: classification quality should be tracked against a defined acceptance threshold before production use.
          </p>
        </TabsContent>

        <TabsContent value="audit" className="mt-5">
          {!logs ? <Loading /> : (
            <div className="overflow-hidden rounded-2xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Detail</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.action}</TableCell>
                      <TableCell>{log.actor}</TableCell>
                      <TableCell className="max-w-xs text-sm text-muted-foreground">{log.detail}</TableCell>
                      <TableCell><RiskBadge level={log.riskLevel} /></TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString('en-NZ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="controls" className="mt-5 grid gap-4 md:grid-cols-2">
          {CONTROLS.map((control) => (
            <div key={control.title} className="rounded-2xl border bg-card p-6">
              <control.icon className="h-6 w-6 text-cyan-500" />
              <h3 className="mt-3 font-display font-semibold">{control.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{control.desc}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
