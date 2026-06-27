import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'

export const governanceWorkflow: WorkflowStep[] = [
  {
    title: 'AI Generates Response',
    description: 'The AI creates a draft recommendation.',
    icon: 'BrainCircuit',
    color: 'bg-blue-100',
  },
  {
    title: 'Confidence Score',
    description: 'The system calculates confidence.',
    icon: 'Gauge',
    color: 'bg-cyan-100',
  },
  {
    title: 'Risk Assessment',
    description: 'Business rules determine the risk level.',
    icon: 'ShieldCheck',
    color: 'bg-orange-100',
  },
  {
    title: 'Human Approval',
    description: 'High-risk responses require human review.',
    icon: 'UserCheck',
    color: 'bg-green-100',
  },
  {
    title: 'Audit Log',
    description: 'Every action is recorded for traceability.',
    icon: 'ClipboardCheck',
    color: 'bg-purple-100',
  },
  {
    title: 'Business Action',
    description: 'Only approved actions are executed.',
    icon: 'CheckCircle2',
    color: 'bg-emerald-100',
  },
]

export const governanceLesson = {
  title: 'AI Governance',

  subtitle:
    'AI governance means using rules, review, accountability and controls so AI systems are safe, transparent and responsible.',

  workflow: governanceWorkflow,

  keyPoints: [
    'Governance defines what AI is allowed to do.',
    'Risky outputs should be reviewed.',
    'Audit logs create traceability.',
    'Policies reduce unsafe or biased AI behaviour.',
    'Confidence scores support review decisions.',
    'Human accountability remains important.',
  ],

  businessExample: {
    title: 'Simple Example',
    description:
      'If an AI system drafts a financial recommendation, governance controls may require confidence scoring, source checking and human approval before it reaches a customer.',
  },
}