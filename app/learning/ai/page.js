'use client'

import { useState } from 'react'
import { BrainCircuit, CheckCircle2, RotateCcw } from 'lucide-react'
import { LabShell, ExerciseCard } from '@/components/learning/LabShell'

const exercises = [
  {
    title: 'Confidence is high. Is approval still needed?',
    context: 'An AI assistant drafts a refund response. It reports 94% confidence, but sending the message would commit the business to a $1,200 refund.',
    options: ['Auto-send because confidence is above 90%.', 'Require human approval because financial impact is high.', 'Lower the model temperature and auto-send.', 'Ask the customer to approve the AI response.'],
    answer: 1,
    explanation: 'Confidence is not authority. A high-impact action needs a control based on business risk, not just model confidence. The AI can draft; a person should approve the commitment.',
  },
  {
    title: 'Grounding before generation',
    context: 'A customer asks whether an event ticket can be transferred. The model knows general ticketing practices, but the organiser has a specific transfer policy.',
    options: ['Let the model answer from general knowledge.', 'Retrieve the organiser policy and constrain the answer to that source.', 'Increase max tokens so the answer is more detailed.', 'Ask the model to sound more confident.'],
    answer: 1,
    explanation: 'The relevant business source should be retrieved first. Grounding reduces unsupported claims and makes the output traceable to the policy that actually governs the decision.',
  },
  {
    title: 'What belongs in the audit log?',
    context: 'An AI-generated reply is edited by a staff member before it is sent.',
    options: ['Only the final message.', 'Only the original AI output.', 'Prompt/version, sources, AI output, confidence/risk, human edit and final action.', 'Nothing, because a human reviewed it.'],
    answer: 2,
    explanation: 'Auditability means reconstructing what happened. You need the model context and output, the control signals, the human intervention and the final action.',
  },
  {
    title: 'Testing an AI workflow',
    context: 'A team says the feature is tested because the API returns 200 and the model produces fluent text.',
    options: ['That is sufficient for an MVP.', 'Add only load testing.', 'Evaluate correctness, grounding, unsafe outputs, confidence calibration, fallback behaviour and approval controls.', 'Test the UI with more browsers.'],
    answer: 2,
    explanation: 'AI quality is behavioural. Functional plumbing matters, but it does not tell you whether the model is correct, grounded, appropriately uncertain or safely controlled.',
  },
]

export default function AILabPage() {
  const [answers, setAnswers] = useState(Array(exercises.length).fill(null))
  const score = answers.reduce((total, selected, index) => total + (selected === exercises[index].answer ? 1 : 0), 0)
  const complete = answers.every((answer) => answer !== null)

  const choose = (index, value) => setAnswers((current) => current.map((answer, i) => i === index ? value : answer))

  return (
    <LabShell
      eyebrow="AI Workflow & Governance Lab"
      title="Build AI controls around business risk, not model hype."
      intro="This lab focuses on the decisions that separate a useful enterprise AI workflow from a chatbot demo: grounding, risk, approval, auditability and behavioural testing."
    >
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><BrainCircuit className="h-5 w-5 text-cyan-300" /><p className="mt-3 font-semibold">Model output ≠ business authority</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><CheckCircle2 className="h-5 w-5 text-emerald-300" /><p className="mt-3 font-semibold">Controls follow impact and risk</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><span className="text-xl">🧪</span><p className="mt-3 font-semibold">Test behaviour, not fluency</p></div>
      </div>

      <div className="space-y-6">
        {exercises.map((exercise, index) => (
          <ExerciseCard key={exercise.title} number={index + 1} {...exercise} selected={answers[index]} onSelect={(value) => choose(index, value)} />
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm text-slate-400">Your result</p><p className="font-display text-3xl font-bold">{score} / {exercises.length}</p></div>
          <button onClick={() => setAnswers(Array(exercises.length).fill(null))} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"><RotateCcw className="h-4 w-4" /> Reset lab</button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">{complete ? (score === exercises.length ? 'Strong result. You are treating AI as a controlled system, not a magic answer box.' : 'Review the explanations above. The pattern is simple: business risk determines the control, and evidence determines trust.') : 'Complete all four scenarios to finish the lab.'}</p>
      </div>
    </LabShell>
  )
}
