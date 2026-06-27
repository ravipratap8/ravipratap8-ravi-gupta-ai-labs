import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'

export const mcpWorkflow: WorkflowStep[] = [
  {
    title: 'User Request',
    description:
      'The user asks the AI to perform a business task.',
    icon: 'MessageSquare',
    color: 'bg-blue-100',
  },
  {
    title: 'AI Understands Intent',
    description:
      'The LLM identifies which business capability is required.',
    icon: 'BrainCircuit',
    color: 'bg-violet-100',
  },
  {
    title: 'Select MCP Tool',
    description:
      'The AI chooses the correct MCP tool instead of guessing.',
    icon: 'Search',
    color: 'bg-cyan-100',
  },
  {
    title: 'Execute Tool',
    description:
      'The MCP server securely calls the business system.',
    icon: 'Database',
    color: 'bg-amber-100',
  },
  {
    title: 'Receive Result',
    description:
      'Structured data is returned from the business application.',
    icon: 'Gauge',
    color: 'bg-green-100',
  },
  {
    title: 'Generate Final Response',
    description:
      'The AI explains the result using trusted business data.',
    icon: 'CheckCircle2',
    color: 'bg-emerald-100',
  },
]

export const mcpLesson = {
  title: 'Model Context Protocol (MCP)',

  subtitle:
    'MCP enables AI models to securely interact with enterprise systems through standardised tools.',

  workflow: mcpWorkflow,

  keyPoints: [
    'Standard protocol for AI tools',
    'Secure business integration',
    'Structured inputs and outputs',
    'Supports enterprise governance',
    'Reusable across AI applications',
    'Ideal for agentic AI',
  ],

  businessExample: {
    title: 'EventPilot AI',

    description:
      'The AI receives "Create an event", calls the create_event MCP tool, stores the event in the database and returns confirmation instead of inventing a response.',
  },
}