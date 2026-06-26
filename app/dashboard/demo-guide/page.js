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
  MessageCircle,
  Route,
  Send,
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
    title: 'Receive WhatsApp enquiry',
    description:
      'A customer message is received through WhatsApp Cloud API and routed into the AI Inbox for processing.',
    coach:
      'This step demonstrates real channel integration. WhatsApp is the inbound channel, while the AI workflow happens inside the application after the webhook receives the customer message.',
    link: '/dashboard/inbox',
    linkText: 'Open AI Inbox',
    icon: MessageCircle,
  },
  {
    step: '2',
    title: 'Classify the message',
    description:
      'The system identifies the enquiry type such as Ticketing, Refund, VIP, Complaint, Lead, Safety, or General.',
    coach:
      'This step demonstrates AI classification. The system analyses the customer message and assigns a category so the workflow can route it correctly.',
    link: '/dashboard/inbox',
    linkText: 'Review Enquiries',
    icon: Route,
  },
  {
    step: '3',
    title: 'Generate AI draft',
    description:
      'AI creates a grounded draft response using available event knowledge. The response is not sent automatically.',
    coach:
      'This step demonstrates grounded draft generation. The AI prepares a response using the available event context, but it is only a draft until a human reviews it.',
    link: '/dashboard/approvals',
    linkText: 'Open Approvals',
    icon: Bot,
  },
  {
    step: '4',
    title: 'Approve, edit, or reject',
    description:
      'A human reviewer remains in control and can approve, edit, or reject the AI-generated response.',
    coach:
      'This step demonstrates human-in-the-loop governance. The AI supports the workflow, but the final customer-facing decision remains with a person.',
    link: '/dashboard/approvals',
    linkText: 'Review Drafts',
    icon: ClipboardCheck,
  },
  {
    step: '5',
    title: 'Audit and governance',
    description:
      'The workflow records AI activity, risk level, confidence score, approval decisions, and audit events.',
    coach:
      'This step demonstrates auditability. AI activity and approval decisions are recorded so the process can be reviewed, tested, and explained.',
    link: '/dashboard/governance',
    linkText: 'Open Governance',
    icon: ShieldCheck,
  },
]

const aiCapabilities = [
  {
    title: 'Message classification',
    description:
      'AI identifies the intent and category of each enquiry, such as Ticketing, Refund, VIP, Complaint, Lead, or General.',
    coach:
      'Classification helps the workflow understand what type of message has arrived and how carefully it should be handled.',
    icon: Route,
  },
  {
    title: 'Grounded draft generation',
    description:
      'AI creates a response using available event knowledge and avoids inventing unsupported event details.',
    coach:
      'Grounded generation means the draft should rely on known event data rather than making unsupported claims.',
    icon: Database,
  },
  {
    title: 'Risk assessment',
    description:
      'Sensitive messages such as refunds, complaints, payment, safety, or policy questions are treated as higher risk.',
    coach:
      'Risk assessment is a key control. High-risk messages should be reviewed carefully before any customer-facing action.',
    icon: ShieldAlert,
  },
  {
    title: 'Confidence scoring',
    description:
      'Each AI output includes a confidence score to support review, triage, and decision-making.',
    coach:
      'Confidence scoring helps reviewers understand how certain the AI appears to be and whether closer review is needed.',
    icon: Gauge,
  },
  {
    title: 'Human approval routing',
    description:
      'AI-generated drafts are routed into an approval queue instead of being sent automatically.',
    coach:
      'Human approval routing prevents unsafe automation. The AI drafts, but the human decides.',
    icon: ClipboardCheck,
  },
  {
    title: 'Audit trail',
    description:
      'Important AI actions and approval decisions are logged so the workflow remains traceable.',
    coach:
      'Auditability supports governance, testing, accountability, and future enterprise review.',
    icon: Workflow,
  },
]

const qaChecks = [
  'WhatsApp webhook receives the message correctly.',
  'AI Inbox record is created against the correct workspace.',
  'Message category, risk level, and confidence score are generated.',
  'AI draft is created and linked to an approval record.',
  'Approve, edit, and reject actions update the workflow correctly.',
  'Audit logs capture AI and approval activity.',
  'High-risk messages remain human-controlled.',
  'AI does not auto-send customer replies.',
]

const voiceCommands = [
  'Open dashboard',
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
  'AI does not make payment or legal commitments.',
  'AI does not delete records by voice command.',
  'Voice Copilot is click-to-speak, not always-on listening.',
  'High-risk actions require human review.',
]

const feedbackQuestions = [
  'Are the risk categories meaningful for an enterprise workflow?',
  'What additional governance controls should be added?',
  'What QA checks would be expected before production use?',
  'How should confidence thresholds influence workflow routing?',
  'What would make this architecture more enterprise-ready?',
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
    'Hover over any demo card to understand the AI workflow, governance control, or QA consideration it demonstrates. Click Explain to hear the explanation.'
  )
  const [coachTitle, setCoachTitle] = useState('Demo Coach')

  return (
    <div>
      <PageHeader
        title="AI EventOps Demo Guide"
        subtitle="From WhatsApp enquiry to governed AI response with human approval, risk scoring, confidence scoring, and auditability."
      />

      <div className="mb-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-sm text-cyan-950">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
          <div>
            <p className="font-semibold">What this demo proves</p>
            <p className="mt-1 leading-relaxed">
              This demo shows how AI can be embedded into a real business workflow, not just exposed
              as a chatbot. A WhatsApp customer enquiry is received, classified by AI, converted into
              a grounded draft response, scored for confidence and risk, routed for human approval,
              and logged for auditability.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-emerald-500" />
            <h2 className="text-sm font-semibold text-foreground">WhatsApp status</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            WhatsApp inbound integration is working in Meta developer test mode. It is suitable for
            a controlled live demo using approved test recipient numbers.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-500" />
            <h2 className="text-sm font-semibold text-foreground">Governance status</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            AI drafts are not sent automatically. Human approval, edit, or rejection is required
            before any customer-facing follow-up.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Send className="h-5 w-5 text-amber-500" />
            <h2 className="text-sm font-semibold text-foreground">Public trial note</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Public self-service WhatsApp trial is not enabled yet. Selected reviewers can be added
            manually as Meta test recipients if required.
          </p>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Workflow className="h-5 w-5 text-cyan-500" />
          <h2 className="text-xl font-semibold text-foreground">Recommended live demo flow</h2>
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
                <p className="mt-2 min-h-28 text-xs leading-relaxed text-muted-foreground">
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
          <Bot className="h-5 w-5 text-cyan-500" />
          <h2 className="text-xl font-semibold text-foreground">Where AI is used</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aiCapabilities.map((item) => {
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

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-foreground">
              QA and testing considerations
            </h2>
          </div>

          <div className="space-y-2">
            {qaChecks.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            AI testing needs to cover behaviour, grounding, confidence, risk, approval traceability,
            and integration reliability — not just whether text was generated.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-foreground">
              Intentionally not automated
            </h2>
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
            These restrictions show deliberate safe AI design. The system supports decision-making,
            but high-risk execution remains under human control.
          </p>
        </section>
      </div>

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
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-foreground">
              Feedback I am looking for
            </h2>
          </div>

          <div className="space-y-2">
            {feedbackQuestions.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
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
              generate_social_content, create_lead, and get_dashboard_metrics. The long-term idea
              is reusable AI workflow architecture across multiple business domains.
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