import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'

export const humanWorkflow: WorkflowStep[] = [
  {
    title: 'User Request',
    description:
      'A customer or employee submits a request.',
    icon: 'MessageSquare',
    color: 'bg-blue-100',
  },
  {
    title: 'AI Analysis',
    description:
      'The AI analyses the request and prepares a recommendation.',
    icon: 'BrainCircuit',
    color: 'bg-violet-100',
  },
  {
    title: 'Confidence Score',
    description:
      'The system estimates how confident it is.',
    icon: 'Gauge',
    color: 'bg-cyan-100',
  },
  {
    title: 'Human Review',
    description:
      'A person reviews high-risk or low-confidence responses.',
    icon: 'UserCheck',
    color: 'bg-orange-100',
  },
  {
    title: 'Approval',
    description:
      'The recommendation is approved or modified.',
    icon: 'ShieldCheck',
    color: 'bg-green-100',
  },
  {
    title: 'Final Action',
    description:
      'Only approved actions are executed.',
    icon: 'CheckCircle2',
    color: 'bg-emerald-100',
  },
]

export const humanLesson = {
  title: 'Human-in-the-Loop',

  subtitle:
    'Enterprise AI should assist people, not replace decision makers for high-risk actions.',

  workflow: humanWorkflow,

  keyPoints: [
    'AI assists people',
    'Humans retain accountability',
    'Low-confidence responses require review',
    'Critical business decisions should be approved',
    'Every approval is auditable',
    'Supports responsible AI governance',
  ],

  businessExample: {
    title: 'EventPilot AI',

    description:
      'The AI drafts a customer refund response, but because confidence is only 68%, the organiser must approve it before it is sent.',
  },
}