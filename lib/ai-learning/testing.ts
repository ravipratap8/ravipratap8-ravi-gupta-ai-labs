import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'

export const testingWorkflow: WorkflowStep[] = [
  {
    title: 'Requirements',
    description:
      'Understand business goals, risks and expected AI behaviour.',
    icon: 'MessageSquare',
    color: 'bg-blue-100',
  },
  {
    title: 'Prompt Validation',
    description:
      'Verify prompts produce expected responses.',
    icon: 'BrainCircuit',
    color: 'bg-violet-100',
  },
  {
    title: 'Hallucination Testing',
    description:
      'Identify fabricated or unsupported responses.',
    icon: 'AlertTriangle',
    color: 'bg-red-100',
  },
  {
    title: 'Risk & Governance',
    description:
      'Validate confidence scores, approvals and audit logs.',
    icon: 'ShieldCheck',
    color: 'bg-orange-100',
  },
  {
    title: 'Regression Testing',
    description:
      'Ensure prompt or model updates do not introduce regressions.',
    icon: 'Gauge',
    color: 'bg-cyan-100',
  },
  {
    title: 'Production Ready',
    description:
      'AI workflow passes validation and is ready for release.',
    icon: 'CheckCircle2',
    color: 'bg-green-100',
  },
]

export const testingLesson = {
  title: 'Testing Enterprise AI',

  subtitle:
    'AI systems require much more than functional testing. Prompts, models, workflows and governance all need validation.',

  workflow: testingWorkflow,

  keyPoints: [
    'Prompt Testing',
    'Hallucination Detection',
    'Regression Testing',
    'Security Testing',
    'Governance Validation',
    'Human Approval Verification',
    'Performance Testing',
    'Evaluation Metrics',
  ],

  businessExample: {
    title: 'EventPilot AI',

    description:
      'Before releasing AI customer replies, prompts are regression tested, hallucination tested and reviewed for governance compliance.',
  },
}