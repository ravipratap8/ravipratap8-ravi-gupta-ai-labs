'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  Volume2,
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
    coach:
      'This step demonstrates context grounding. The AI should not answer like a generic chatbot. It uses stored event information such as date, venue, FAQs, and policy notes before drafting a response.',
    link: '/dashboard/events',
    linkText: 'Open Events',
    icon: Database,
  },
  {
    step: '2',
    title: 'Add a sample enquiry',
    description:
      'The AI Inbox simulates a customer enquiry. The system classifies the message, generates a draft reply, assigns risk, and stores confidence.',
    coach:
      'This step demonstrates the AI workflow. A customer message is received, classified, risk assessed, given a confidence score, and converted into a draft response for review.',
    link: '/dashboard/inbox',
    linkText: 'Open AI Inbox',
    icon: Bot,
  },
  {
    step: '3',
    title: 'Review AI response',
    description:
      'The AI draft is visible for review. It is not sent automatically. High-risk items such as refunds and complaints are queued for human approval.',
    coach:
      'This step demonstrates safe AI review. The AI can draft a response, but the system does not send it automatically. A human can inspect the content, risk, and confidence before action.',
    link: '/dashboard/approvals',
    linkText: 'Open Approvals',
    icon: ClipboardCheck,
  },
  {
    step: '4',
    title: 'Approve or reject',
    description:
      'A human user remains in control. The draft can be approved, edited, or rejected before any follow-up action.',
    coach:
      'This step demonstrates human-in-the-loop control. The human can approve, edit, or reject the AI draft. This is important for refunds, complaints, and policy-sensitive messages.',
    link: '/dashboard/approvals',
    linkText: 'Review Drafts',
    icon: CheckCircle2,
  },
  {
    step: '5',
    title: 'Check governance',
    description:
      'The governance view explains risk controls, audit logging, prompt safety, human approval, and AI test controls.',
    coach:
      'This step demonstrates AI governance. The system records AI activity, approval decisions, model source, confidence, risk level, and audit events so the workflow is explainable and testable.',
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
    coach:
      'Context grounding means the AI response is based on business data already stored in the system, such as event details, venue, date, and organiser policy.',
    icon: Database,
  },
  {
    title: 'Classification',
    description:
      'Incoming enquiries are classified into categories such as Refund, Ticketing, Sponsorship, Complaint, or General.',
    coach:
      'Classification helps the workflow decide what type of enquiry this is. For example, a refund request can be handled differently from a parking question or sponsorship enquiry.',
    icon: Route,
  },
  {
    title: 'Confidence scoring',
    description:
      'Each AI draft includes a confidence score to support review, triage, and decision-making.',
    coach:
      'Confidence scoring helps reviewers understand how certain the AI is. Lower confidence items can be flagged for closer human review.',
    icon: Gauge,
  },
  {
    title: 'Risk assessment',
    description:
      'Refunds, complaints, payment-sensitive, policy-sensitive, or unclear messages are treated as higher risk.',
    coach:
      'Risk assessment prevents unsafe automation. Sensitive items such as refunds, complaints, payment questions, and policy commitments should require human review.',
    icon: ShieldAlert,
  },
  {
    title: 'Human-in-the-loop',
    description:
      'AI drafts the response, but a human must approve, edit, or reject it before follow-up.',
    coach:
      'Human-in-the-loop means AI supports the workflow, but the final decision remains with a person. This is the core safety principle in this demo.',
    icon: ClipboardCheck,
  },
  {
    title: 'Auditability',
    description:
      'AI actions and approval decisions are logged so the workflow is traceable and explainable.',
    coach:
      'Auditability means each important AI action is recorded. This helps with governance, testing, accountability, and future enterprise review.',
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

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.95
  utterance.pitch = 1
  utterance.volume = 1

  window.speechSynthesis.speak(utterance)
}

function stopSpeaking() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

function ExplainButton({ text }) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className="inline-flex items-center gap-1 rounded-full border border-cyan-300 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-800 transition hover:bg-cyan-100"
    >
      <Volume2 className="h-3 w-3" />
      Explain
    </button>
  )
}

export default function DemoGuidePage() {
  const [coachText, setCoachText] = useState(
    'Hover over any demo card to understand what AI capability or governance principle it demonstrates. Click Explain to hear the explanation.'
  )
  const [coachTitle, setCoachTitle] = useState('Demo Coach')

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
              <div
                key={item.step}
                onMouseEnter={() => {
                  setCoachTitle(item.title)
                  setCoachText(item.coach)
                }}
                onFocus={() => {
                  setCoachTitle(item.title)
                  setCoachText(item.coach)
                }}
                className="rounded-2xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
              >
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

                <div className="mt-4 flex items-center gap-2">
                  <ExplainButton text={item.coach} />

                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={item.link}>
                      {item.linkText}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
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
              <div
                key={item.title}
                onMouseEnter={() => {
                  setCoachTitle(item.title)
                  setCoachText(item.coach)
                }}
                onFocus={() => {
                  setCoachTitle(item.title)
                  setCoachText(item.coach)
                }}
                className="rounded-2xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
              >
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-muted">
                  <Icon className="h-5 w-5 text-cyan-500" />
                </div>

                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-4">
                  <ExplainButton text={item.coach} />
                </div>
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

      <div className="fixed bottom-24 right-6 z-40 hidden w-80 rounded-2xl border border-cyan-200 bg-card p-4 shadow-2xl lg:block">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-100 text-cyan-700">
              <Bot className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{coachTitle}</p>
              <p className="text-[11px] text-muted-foreground">Hover card or click Explain</p>
            </div>
          </div>

          <button
            type="button"
            onClick={stopSpeaking}
            className="rounded-full border px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted"
          >
            Stop
          </button>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">{coachText}</p>

        <Button
          type="button"
          size="sm"
          className="mt-3 w-full bg-cyan-500 hover:bg-cyan-600"
          onClick={() => speak(coachText)}
        >
          <Volume2 className="mr-1.5 h-4 w-4" />
          Explain this
        </Button>
      </div>
    </div>
  )
}