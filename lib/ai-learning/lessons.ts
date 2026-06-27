export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  icon: string
  href: string
}

export const lessons: Lesson[] = [
  {
    id: 'ai-basics',
    title: 'AI Basics',
    description:
      'Understand what AI is, how it works, and where it is used in everyday life.',
    duration: '10 mins',
    difficulty: 'Beginner',
    icon: '🧠',
    href: '/ai-learning/ai-basics',
  },
  {
    id: 'llm',
    title: 'Large Language Models',
    description:
      'Learn how ChatGPT-style models understand prompts and generate responses.',
    duration: '12 mins',
    difficulty: 'Beginner',
    icon: '🤖',
    href: '/ai-learning/large-language-models',
  },
  {
    id: 'prompt',
    title: 'Prompt Engineering',
    description:
      'Learn how clear instructions improve AI responses across any use case.',
    duration: '8 mins',
    difficulty: 'Beginner',
    icon: '💬',
    href: '/ai-learning/prompt-engineering',
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation',
    description:
      'See how AI uses external knowledge instead of relying only on memory.',
    duration: '10 mins',
    difficulty: 'Beginner',
    icon: '📚',
    href: '/ai-learning/rag',
  },
  {
    id: 'hallucination',
    title: 'AI Hallucinations',
    description:
      'Understand why AI sometimes invents facts and how to reduce that risk.',
    duration: '12 mins',
    difficulty: 'Intermediate',
    icon: '⚠️',
    href: '/ai-learning/hallucinations',
  },
  {
    id: 'governance',
    title: 'AI Governance',
    description:
      'Learn how safe AI systems use controls, policies, review and accountability.',
    duration: '15 mins',
    difficulty: 'Intermediate',
    icon: '🛡️',
    href: '/ai-learning/ai-governance',
  },
  {
    id: 'human',
    title: 'Human-in-the-Loop',
    description:
      'Understand when people should review or approve AI decisions.',
    duration: '10 mins',
    difficulty: 'Intermediate',
    icon: '👨‍💼',
    href: '/ai-learning/human-in-loop',
  },
  {
    id: 'confidence',
    title: 'Confidence Scoring',
    description:
      'Learn how AI confidence, uncertainty and risk should be interpreted.',
    duration: '9 mins',
    difficulty: 'Intermediate',
    icon: '📈',
    href: '/ai-learning/confidence-scoring',
  },
  {
    id: 'agents',
    title: 'AI Agents',
    description:
      'Learn how AI agents plan tasks, use tools and complete multi-step workflows.',
    duration: '15 mins',
    difficulty: 'Advanced',
    icon: '🧭',
    href: '/ai-learning/ai-agents',
  },
  {
    id: 'mcp',
    title: 'Model Context Protocol',
    description:
      'Understand how AI connects safely to tools, apps and business systems.',
    duration: '15 mins',
    difficulty: 'Advanced',
    icon: '🔌',
    href: '/ai-learning/mcp',
  },
  {
    id: 'testing',
    title: 'Testing AI Systems',
    description:
      'Learn how AI outputs, prompts, risks and regressions are tested.',
    duration: '18 mins',
    difficulty: 'Advanced',
    icon: '🧪',
    href: '/ai-learning/ai-testing',
  },
]