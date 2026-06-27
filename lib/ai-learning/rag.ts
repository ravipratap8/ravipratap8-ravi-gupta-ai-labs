import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'

export const ragWorkflow: WorkflowStep[] = [
  {
    title: 'User Question',
    description:
      'A user asks a business question that requires accurate information.',
    icon: 'MessageSquare',
    color: 'bg-blue-100',
  },
  {
    title: 'Retrieve Documents',
    description:
      'Search enterprise knowledge, FAQs, policies and documentation.',
    icon: 'Search',
    color: 'bg-violet-100',
  },
  {
    title: 'Select Relevant Context',
    description:
      'Only the most relevant document chunks are selected.',
    icon: 'Database',
    color: 'bg-cyan-100',
  },
  {
    title: 'Generate Response',
    description:
      'The LLM answers using the retrieved context instead of guessing.',
    icon: 'BrainCircuit',
    color: 'bg-amber-100',
  },
  {
    title: 'Confidence & Risk',
    description:
      'Confidence scoring and governance determine whether review is required.',
    icon: 'ShieldCheck',
    color: 'bg-emerald-100',
  },
  {
    title: 'Approved Response',
    description:
      'The grounded answer is returned with auditability.',
    icon: 'CheckCircle2',
    color: 'bg-green-100',
  },
]

export const ragLesson = {
  title: 'Retrieval Augmented Generation (RAG)',

  subtitle:
    'Enterprise AI retrieves trusted information before generating a response, dramatically reducing hallucinations.',

  workflow: ragWorkflow,

  keyPoints: [
    'Uses trusted business knowledge',
    'Reduces hallucinations',
    'Improves answer accuracy',
    'Supports enterprise governance',
    'Works with private company data',
  ],

  businessExample: {
    title: 'EventPilot AI',
    description:
      'Customer asks: "Can I cancel my ticket?" The AI retrieves the organiser cancellation policy before generating a response.',
  },
}