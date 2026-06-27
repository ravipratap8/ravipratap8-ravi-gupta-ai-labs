import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'

export const confidenceWorkflow: WorkflowStep[] = [
  {
    title: 'User Request',
    description: 'The AI receives a business question.',
    icon: 'MessageSquare',
    color: 'bg-blue-100',
  },
  {
    title: 'Gather Context',
    description: 'Relevant knowledge is retrieved.',
    icon: 'Database',
    color: 'bg-cyan-100',
  },
  {
    title: 'Generate Response',
    description: 'The model produces an answer.',
    icon: 'BrainCircuit',
    color: 'bg-violet-100',
  },
  {
    title: 'Calculate Confidence',
    description: 'The system estimates confidence using evidence and model signals.',
    icon: 'Gauge',
    color: 'bg-yellow-100',
  },
  {
    title: 'Risk Decision',
    description: 'Low confidence increases review priority.',
    icon: 'AlertTriangle',
    color: 'bg-orange-100',
  },
  {
    title: 'Final Outcome',
    description: 'The answer is approved or escalated for review.',
    icon: 'CheckCircle2',
    color: 'bg-green-100',
  },
]

export const confidenceLesson = {
  title: 'Confidence Scoring',

  subtitle:
    'Confidence scoring helps users understand how certain an AI system is about its response, but confidence is not the same as correctness.',

  workflow: confidenceWorkflow,

  keyPoints: [
    'Confidence is not accuracy.',
    'High confidence can still be wrong.',
    'Low confidence should trigger human review.',
    'Confidence helps prioritise risky outputs.',
    'Confidence should be combined with evidence and source quality.',
    'Users should never treat confidence as a guarantee.',
  ],

  businessExample: {
    title: 'Simple Example',
    description:
      'If an AI assistant is only 42% confident about an answer, it should explain uncertainty or route the request for human review.',
  },
}