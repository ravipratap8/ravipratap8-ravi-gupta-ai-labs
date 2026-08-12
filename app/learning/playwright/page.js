'use client'

import { useState } from 'react'
import { Code2, RotateCcw } from 'lucide-react'
import { LabShell, ExerciseCard } from '@/components/learning/LabShell'

const exercises = [
  {
    title: 'Choose the most resilient locator',
    context: 'You need to click the Save button. The DOM contains a generated CSS class, visible text "Save", and an accessible role/name.',
    options: ["page.locator('.css-8f31x')", "page.getByRole('button', { name: 'Save' })", "page.locator('button').nth(3)", "page.getByText('Save').first()"],
    answer: 1,
    explanation: 'Role-based locators reflect how users and assistive technology identify the control. They are usually more stable and expressive than generated classes or positional selectors.',
  },
  {
    title: 'Wait for behaviour, not time',
    context: 'After Submit, an API call completes and a success banner appears. The test is flaky in CI.',
    options: ['Add waitForTimeout(5000).', 'Retry the test three times.', 'Assert the success banner or relevant network/URL state and let Playwright auto-wait.', 'Run the test only in headed mode.'],
    answer: 2,
    explanation: 'Fixed sleeps hide race conditions and waste time. Synchronise with an observable outcome. Playwright assertions auto-wait for the expected condition.',
  },
  {
    title: 'What should an assertion prove?',
    context: 'A checkout test clicks Pay and only checks that the button disappears.',
    options: ['That is enough because the click worked.', 'Assert the actual business outcome, such as confirmation, order ID and persisted state.', 'Add a screenshot and stop there.', 'Check that no console logs appeared.'],
    answer: 1,
    explanation: 'Automation should prove business behaviour, not just UI mechanics. A button disappearing says very little about whether payment and order creation actually succeeded.',
  },
  {
    title: 'When should you use API setup?',
    context: 'Every UI test spends 40 seconds navigating screens just to create prerequisite data before testing a small account setting.',
    options: ['Always keep setup through UI because it is more realistic.', 'Use API or fixtures for prerequisite state when the setup flow is not what the test is validating.', 'Increase test timeout.', 'Merge all scenarios into one long end-to-end test.'],
    answer: 1,
    explanation: 'Use the UI for behaviour you actually want to validate. Fast deterministic setup through APIs or fixtures keeps tests focused, reduces runtime and lowers flakiness.',
  },
]

export default function PlaywrightLabPage() {
  const [answers, setAnswers] = useState(Array(exercises.length).fill(null))
  const score = answers.reduce((total, selected, index) => total + (selected === exercises[index].answer ? 1 : 0), 0)
  const choose = (index, value) => setAnswers((current) => current.map((answer, i) => i === index ? value : answer))

  return (
    <LabShell
      eyebrow="Playwright Test Automation Lab"
      title="Reliable automation is test design plus code."
      intro="The fastest way to create a brittle suite is to automate clicks without thinking about intent, observability, state and failure diagnosis. These exercises focus on the choices that make Playwright tests useful in CI."
    >
      <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 font-mono text-sm text-slate-300">
        <p className="text-slate-500">// The goal is not this:</p>
        <p className="mt-2">click → sleep → click → sleep → expect(true)</p>
        <p className="mt-4 text-cyan-300">// The goal is observable, deterministic evidence of business behaviour.</p>
      </div>
      <div className="space-y-6">
        {exercises.map((exercise, index) => <ExerciseCard key={exercise.title} number={index + 1} {...exercise} selected={answers[index]} onSelect={(value) => choose(index, value)} />)}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">
        <div className="flex items-center gap-4"><Code2 className="h-6 w-6 text-cyan-300" /><div><p className="text-sm text-slate-400">Current score</p><p className="font-display text-2xl font-bold">{score} / {exercises.length}</p></div></div>
        <button onClick={() => setAnswers(Array(exercises.length).fill(null))} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"><RotateCcw className="h-4 w-4" /> Reset lab</button>
      </div>
    </LabShell>
  )
}
