'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

export interface QuizQuestion {
  question: string
  options: string[]
  answer: string
  explanation: string
}

interface QuizProps {
  title?: string
  questions: QuizQuestion[]
}

export function Quiz({ title = 'Quick Check', questions }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      return selectedAnswers[index] === question.answer ? total + 1 : total
    }, 0)
  }, [questions, selectedAnswers])

  function selectAnswer(questionIndex: number, option: string) {
    if (submitted) return

    setSelectedAnswers((current) => ({
      ...current,
      [questionIndex]: option,
    }))
  }

  function resetQuiz() {
    setSelectedAnswers({})
    setSubmitted(false)
  }

  const allAnswered = questions.every((_, index) => selectedAnswers[index])

  return (
    <section className="rounded-3xl border bg-card p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Knowledge Check
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {title}
          </h2>
        </div>

        {submitted && (
          <div className="rounded-full bg-muted px-5 py-2 text-sm font-semibold">
            Score: {score}/{questions.length}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((question, questionIndex) => {
          const selected = selectedAnswers[questionIndex]
          const isCorrect = selected === question.answer

          return (
            <div key={question.question} className="rounded-2xl border bg-background p-5">
              <h3 className="font-semibold">
                {questionIndex + 1}. {question.question}
              </h3>

              <div className="mt-4 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selected === option
                  const isAnswer = question.answer === option

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(questionIndex, option)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'bg-card hover:bg-muted'
                      } ${
                        submitted && isAnswer
                          ? 'border-green-500 bg-green-50 text-green-900'
                          : ''
                      } ${
                        submitted && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-50 text-red-900'
                          : ''
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              {submitted && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-muted p-4">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
                  )}

                  <p className="text-sm leading-6 text-muted-foreground">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered || submitted}
          className="rounded-full"
        >
          Submit Quiz
        </Button>

        <Button
          variant="outline"
          onClick={resetQuiz}
          className="rounded-full"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </section>
  )
}