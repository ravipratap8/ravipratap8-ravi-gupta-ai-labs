'use client'

import { useState } from 'react'
import { Network, RotateCcw } from 'lucide-react'
import { LabShell, ExerciseCard } from '@/components/learning/LabShell'

const exercises = [
  {
    title: 'HTTP 200, but is the API correct?',
    context: 'POST /orders returns 200 with an order object. The total is wrong because a discount was applied twice.',
    options: ['Pass. The endpoint returned 200.', 'Fail. Validate business invariants such as totals, tax, discount rules and persisted state.', 'Pass if schema is valid.', 'Only UI tests can find this.'],
    answer: 1,
    explanation: 'Status codes prove transport-level behaviour. API tests should validate the business contract and data invariants that consumers actually depend on.',
  },
  {
    title: 'Test the negative contract',
    context: 'An endpoint requires quantity > 0, but all automated tests use valid positive values.',
    options: ['That is fine for happy-path coverage.', 'Add zero, negative, missing, wrong type and boundary cases with explicit error-contract assertions.', 'Randomly generate values without checking expected behaviour.', 'Move these cases to manual testing only.'],
    answer: 1,
    explanation: 'The contract includes rejection behaviour. Negative and boundary cases reveal whether validation is consistent, safe and useful to API consumers.',
  },
  {
    title: 'Consumer compatibility',
    context: 'A service team renames response field customerId to id. Their unit tests still pass.',
    options: ['Ship it because the service tests are green.', 'Use contract/consumer tests to detect breaking interface changes before release.', 'Only update the Swagger page.', 'Ask consumers to adapt after deployment.'],
    answer: 1,
    explanation: 'A provider can be internally correct and still break consumers. Contract testing makes compatibility an executable release signal.',
  },
  {
    title: 'State transition matters',
    context: 'PATCH /orders/123/cancel returns a valid cancelled response, but the inventory reservation is never released.',
    options: ['Pass because the response schema is correct.', 'Validate downstream state and side effects that are part of the cancellation business transaction.', 'Only check response time.', 'Add more headers to the request.'],
    answer: 1,
    explanation: 'APIs often represent business transactions, not isolated responses. Test state transitions and important side effects across the system boundary.',
  },
]

export default function ApiTestingLabPage() {
  const [answers, setAnswers] = useState(Array(exercises.length).fill(null))
  const score = answers.reduce((total, selected, index) => total + (selected === exercises[index].answer ? 1 : 0), 0)
  const choose = (index, value) => setAnswers((current) => current.map((answer, i) => i === index ? value : answer))

  return (
    <LabShell
      eyebrow="API Testing Beyond Status Codes"
      title="An API contract is behaviour, data and state."
      intro="Good API testing checks far more than endpoint availability. Work through contracts, boundaries, compatibility and state transitions using realistic failure modes."
    >
      <div className="mb-8 grid gap-3 sm:grid-cols-4">
        {['Transport', 'Schema', 'Business rules', 'State & side effects'].map((item, index) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs text-slate-500">Layer {index + 1}</p><p className="mt-1 font-semibold">{item}</p></div>
        ))}
      </div>
      <div className="space-y-6">
        {exercises.map((exercise, index) => <ExerciseCard key={exercise.title} number={index + 1} {...exercise} selected={answers[index]} onSelect={(value) => choose(index, value)} />)}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">
        <div className="flex items-center gap-4"><Network className="h-6 w-6 text-cyan-300" /><div><p className="text-sm text-slate-400">Current score</p><p className="font-display text-2xl font-bold">{score} / {exercises.length}</p></div></div>
        <button onClick={() => setAnswers(Array(exercises.length).fill(null))} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"><RotateCcw className="h-4 w-4" /> Reset lab</button>
      </div>
    </LabShell>
  )
}
