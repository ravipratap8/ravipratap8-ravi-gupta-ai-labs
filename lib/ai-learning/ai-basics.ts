import type { WorkflowStep } from '@/components/ai-learning/WorkflowEngine'
import type { QuizQuestion } from '@/components/ai-learning/Quiz'

export const aiBasicsWorkflow: WorkflowStep[] = [
  {
    title: 'Input Data',
    description:
      'AI starts with data such as text, images, audio, numbers or user behaviour.',
    icon: 'Database',
    color: 'bg-blue-100',
  },
  {
    title: 'Pattern Learning',
    description:
      'AI systems learn patterns from examples instead of following only fixed rules.',
    icon: 'BrainCircuit',
    color: 'bg-violet-100',
  },
  {
    title: 'Model Prediction',
    description:
      'The model uses learned patterns to predict, classify, recommend or generate output.',
    icon: 'Gauge',
    color: 'bg-cyan-100',
  },
  {
    title: 'Output',
    description:
      'AI produces an answer, recommendation, classification, image, summary or action.',
    icon: 'CheckCircle2',
    color: 'bg-green-100',
  },
  {
    title: 'Human Review',
    description:
      'People review important AI outputs, especially when accuracy or safety matters.',
    icon: 'UserCheck',
    color: 'bg-orange-100',
  },
  {
    title: 'Improve System',
    description:
      'Feedback and testing help improve future AI performance.',
    icon: 'ShieldCheck',
    color: 'bg-emerald-100',
  },
]

export const aiBasicsQuiz: QuizQuestion[] = [
  {
    question: 'What is the simplest way to describe AI?',
    options: [
      'Software that recognises patterns and helps make predictions or decisions',
      'A normal database',
      'A guaranteed source of truth',
      'A replacement for all human judgement',
    ],
    answer:
      'Software that recognises patterns and helps make predictions or decisions',
    explanation:
      'AI works by learning patterns from data and using those patterns to classify, predict, recommend or generate outputs.',
  },
  {
    question: 'Why should important AI outputs be reviewed?',
    options: [
      'Because AI can be wrong even when it sounds confident',
      'Because AI never uses data',
      'Because AI cannot generate text',
      'Because AI is always deterministic',
    ],
    answer: 'Because AI can be wrong even when it sounds confident',
    explanation:
      'AI systems can produce fluent but incorrect outputs, so human review is important for high-risk decisions.',
  },
]

export const aiBasicsLesson = {
  title: 'AI Basics',

  subtitle:
    'Artificial Intelligence is software that can recognise patterns, make predictions, generate content and assist decision-making.',

  workflow: aiBasicsWorkflow,

  quiz: aiBasicsQuiz,

  keyPoints: [
    'AI is not magic. It is pattern recognition at scale.',
    'AI can classify, predict, recommend, summarise and generate content.',
    'AI quality depends heavily on data, context and instructions.',
    'AI can be wrong, even when it sounds confident.',
    'Human review matters for important decisions.',
    'Testing and governance make AI safer.',
  ],

  businessExample: {
    title: 'Everyday Example',

    description:
      'When Netflix recommends a movie, your email filters spam, Google Maps predicts traffic, or ChatGPT drafts text, AI is using patterns to produce a useful output.',
  },
}