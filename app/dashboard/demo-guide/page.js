import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Gauge,
  Mic,
  Route,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Workflow,
  XCircle,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui'
import { Button } from '@/components/ui/button'

const demoFlow = [
  {
    step: '1',
    title: 'Review event knowledge',
    description:
      'Events act as the AI knowledge base. Draft replies are grounded in event details such as venue, date, policy notes, and FAQs.',
    link: '/dashboard/events',
    linkText: 'Open Events',
    icon: Database,
  },
  {
    step: '2',
    title: 'Add a sample enquiry',
    description:
      'The AI Inbox simulates a customer enquiry. The system classifies the message, generates a draft reply, assigns risk, and stores confidence.',
    link: '/dashboard/inbox',
    linkText: 'Open AI Inbox',
    icon: Bot,
  },
  {
    step: '3',
    title: 'Review AI response',
    description:
      'The AI draft is visible for review. It is not sent automatically. High-risk items such as refunds and complaints are queued for human approval.',
    link: '/dashboard/approvals',
    linkText: 'Open Approvals',
    icon: ClipboardCheck,
  },
  {
    step: '4',
    title: 'Approve or reject',
    description:
      'A human user remains in control. The draft can be approved, edited, or rejected before any follow-up action.',
    link: '/dashboard/approvals',
    linkText: 'Review Drafts',
    icon: CheckCircle2,
  },
  {
    step: '5',
    title: 'Check governance',
    description:
      'The governance view explains risk controls, audit logging, prompt safety, human approval, and AI test controls.',
    link: '/dashboard/governance',
    linkText: 'Open Governance',
    icon: ShieldCheck,
  },
]

const principles = [
  {
    title: 'Context grounding',
    description:
      'AI output is based on stored event information rather than a generic chatbot answer.',
    icon: Database,
  },
  {
    title: 'Classification',
    description:
      'Incoming enquiries are classified into categories such as Refund, Ticketing, Sponsorship, Complaint, or General.',
    icon: Route,
  },
  {
    title: 'Confidence scoring',
    description:
      'Each AI draft includes a confidence score to support review, triage, and decision-making.',
    icon: Gauge,
  },
  {
    title: 'Risk assessment',
    description:
      'Refunds, complaints, payment-sensitive, policy-sensitive, or unclear messages are treated as higher risk.',
    icon: ShieldAlert,
  },
  {
    title: 'Human-in-the-loop',
    description:
      'AI drafts the response, but a human must approve, edit, or reject it before follow-up.',
    icon: ClipboardCheck,
  },
  {
    title: 'Auditability',
    description:
      'AI actions and approval decisions are logged so the workflow is traceable and explainable.',
    icon: Workflow,
  },
]

const voiceCommands = [
  'Open dashboard',
  'Open events',
  'Open AI inbox',
  'Open approvals',
  'Open governance',
  'Create sample enquiry',
  'Approve draft',
  'Reject draft',
]

const disabledActions = [
  'AI does not auto-send customer replies.',
  'AI does not approve refunds or policy decisions.',
  'AI does not delete records by voice command.',
  'Voice Copilot is click-to-speak, not always-on listening.',
  'High-risk actions require human review.',
]

export default function DemoGuidePage() {
  return (
    <div>
      <PageHeader
        title="How to Try This Demo"
        subtitle="A guided walkthrough of the AI EventOps workflow, AI governance controls, and human-in-the-loop design."
      />

      <div className="mb-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-sm text-cyan-950">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
          <div>
            <p className="font-semibold">What this demo proves</p>
            <p className="mt-1 leading-relaxed">
              This is not a simple chatbot wrapper. It demonstrates an enterprise-style AI workflow:
              business context, AI classification, grounded draft generation, confidence scoring,
              risk assessment, human approval, and audit logging.
            </p>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Workflow className="h-5 w-5 text-cyan-500" />
          <h2 className="text-xl font-semibold text-foreground">Recommended demo flow</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          {demoFlow.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.step} className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                    {item.step}
                  </span>
                  <Icon className="h-5 w-5 text-cyan-500" />
                </div>

                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 min-h-24 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link href={item.link}>
                    {item.linkText}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-semibold text-foreground">AI principles demonstrated</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.title} className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-muted">
                  <Icon className="h-5 w-5 text-cyan-500" />
                </div>

                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Mic className="h-5 w-5 text-cyan-500" />
            <h2 className="text-lg font-semibold text-foreground">
              Voice Copilot commands to try
            </h2>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {voiceCommands.map((command) => (
              <div
                key={command}
                className="rounded-xl border bg-muted/50 px-3 py-2 text-sm text-foreground"
              >
                “{command}”
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Voice Copilot is designed as a workflow controller. It helps navigate and trigger safe
            actions, but it does not perform unsafe autonomous operations.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-foreground">Intentionally disabled</h2>
          </div>

          <div className="space-y-2">
            {disabledActions.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            These restrictions show safe AI design: the system supports decision-making, but
            high-risk execution remains under human control.
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-cyan-950">
        <div className="flex items-start gap-3">
          <Workflow className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
          <div>
            <h2 className="text-lg font-semibold">MCP-ready architecture direction</h2>
            <p className="mt-2 text-sm leading-relaxed">
              The same workflow can later be exposed as typed MCP tools such as create_event,
              search_event, classify_message, generate_customer_reply, approve_ai_reply,
              generate_social_content, create_lead, and get_dashboard_metrics.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}