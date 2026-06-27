import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'

export const promptWorkflow: WorkflowStep[] = [
  {
    title: 'User Prompt',
    description:
      'The user provides instructions to the AI.',
    icon: 'MessageSquare',
    color: 'bg-blue-100',
  },
  {
    title: 'Analyse Intent',
    description:
      'The AI understands what the user is asking.',
    icon: 'BrainCircuit',
    color: 'bg-violet-100',
  },
  {
    title: 'Apply Context',
    description:
      'Relevant business context and system instructions are added.',
    icon: 'Database',
    color: 'bg-cyan-100',
  },
  {
    title: 'Generate Response',
    description:
      'The model creates a response based on the prompt.',
    icon: 'BrainCircuit',
    color: 'bg-amber-100',
  },
  {
    title: 'Evaluate Quality',
    description:
      'The response is checked for accuracy and completeness.',
    icon: 'Gauge',
    color: 'bg-orange-100',
  },
  {
    title: 'Final Output',
    description:
      'The user receives the improved AI response.',
    icon: 'CheckCircle2',
    color: 'bg-green-100',
  },
]

export const promptLesson = {
  title: 'Prompt Engineering',

  subtitle:
    'Good prompts dramatically improve AI output quality, consistency and reliability.',

  workflow: promptWorkflow,

  keyPoints: [
    'Be specific.',
    'Give clear instructions.',
    'Provide business context.',
    'Define output format.',
    'Set constraints.',
    'Iterate and improve prompts.',
  ],

  businessExample: {
    title: 'Customer Support',

    description:
      'Instead of asking "Reply to this customer", an enterprise prompt includes company policies, tone of voice, response length and approved knowledge sources.',
  },
}