import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'

export const hallucinationWorkflow: WorkflowStep[] = [
  {
    title: 'User Question',
    description: 'The user asks a question.',
    icon: 'MessageSquare',
    color: 'bg-blue-100',
  },
  {
    title: 'LLM Uses Memory',
    description:
      'Without reliable context, the model relies on learned patterns.',
    icon: 'BrainCircuit',
    color: 'bg-violet-100',
  },
  {
    title: 'Hallucination Risk',
    description:
      'The model may confidently produce information that is incorrect.',
    icon: 'AlertTriangle',
    color: 'bg-red-100',
  },
  {
    title: 'Retrieve Knowledge',
    description:
      'Trusted sources are searched before the answer is generated.',
    icon: 'Search',
    color: 'bg-cyan-100',
  },
  {
    title: 'Ground Response',
    description:
      'The answer is based on verified context instead of guessing.',
    icon: 'Database',
    color: 'bg-green-100',
  },
  {
    title: 'Trusted Answer',
    description:
      'The user receives a more reliable and explainable response.',
    icon: 'CheckCircle2',
    color: 'bg-emerald-100',
  },
]

export const hallucinationLesson = {
  title: 'AI Hallucinations',

  subtitle:
    'AI hallucinations happen when a model produces information that sounds correct but is false, unsupported or misleading.',

  workflow: hallucinationWorkflow,

  keyPoints: [
    'AI can sound confident while being wrong.',
    'LLMs predict likely text, not guaranteed truth.',
    'Missing context increases hallucination risk.',
    'RAG reduces risk by adding trusted sources.',
    'Human review is important for high-impact answers.',
    'Citations and audit logs improve accountability.',
  ],

  businessExample: {
    title: 'Simple Example',
    description:
      'If a user asks about a company refund policy and the AI has no policy document, it may invent a rule. A safer system retrieves the actual policy before answering.',
  },
}