import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'
import type { QuizQuestion } from '@/components/ai-learning/Quiz'

export const llmWorkflow: WorkflowStep[] = [
  {
    title: 'User Prompt',
    description:
      'A person types a question, instruction or request in natural language.',
    icon: 'MessageSquare',
    color: 'bg-blue-100',
  },
  {
    title: 'Tokenisation',
    description:
      'The text is broken into smaller units called tokens.',
    icon: 'Search',
    color: 'bg-cyan-100',
  },
  {
    title: 'Context Window',
    description:
      'The model looks at the prompt and available context together.',
    icon: 'Database',
    color: 'bg-violet-100',
  },
  {
    title: 'Next Token Prediction',
    description:
      'The model predicts likely next tokens based on learned language patterns.',
    icon: 'BrainCircuit',
    color: 'bg-amber-100',
  },
  {
    title: 'Generated Response',
    description:
      'Tokens are combined into a fluent answer, summary, plan or draft.',
    icon: 'CheckCircle2',
    color: 'bg-green-100',
  },
  {
    title: 'Review Output',
    description:
      'The answer should be checked when accuracy, safety or business risk matters.',
    icon: 'ShieldCheck',
    color: 'bg-emerald-100',
  },
]

export const llmQuiz: QuizQuestion[] = [
  {
    question: 'What does an LLM mainly do when generating text?',
    options: [
      'Predicts likely next tokens based on context',
      'Looks up every answer from a live database',
      'Always calculates mathematically perfect answers',
      'Copies one fixed answer from memory',
    ],
    answer: 'Predicts likely next tokens based on context',
    explanation:
      'LLMs generate responses by predicting likely token sequences based on the prompt, context and learned patterns.',
  },
  {
    question: 'Why can LLMs be wrong?',
    options: [
      'They generate likely language, not guaranteed truth',
      'They cannot read text',
      'They only work with images',
      'They never use patterns',
    ],
    answer: 'They generate likely language, not guaranteed truth',
    explanation:
      'An LLM can produce fluent but incorrect answers because language probability is not the same as factual certainty.',
  },
]

export const llmLesson = {
  title: 'Large Language Models',

  subtitle:
    'Large Language Models are AI systems trained on huge amounts of text to understand prompts and generate human-like responses.',

  workflow: llmWorkflow,

  quiz: llmQuiz,

  keyPoints: [
    'LLMs generate text by predicting likely next tokens.',
    'They do not truly “know” facts like a database.',
    'They are strong at language, summarisation, drafting and reasoning support.',
    'They can be wrong or outdated without external knowledge.',
    'Prompt quality and context strongly affect output quality.',
    'Important outputs should be verified.',
  ],

  businessExample: {
    title: 'Simple Example',

    description:
      'When you ask ChatGPT to summarise an email, the model reads the text, predicts a concise summary and generates a natural-language response.',
  },
}