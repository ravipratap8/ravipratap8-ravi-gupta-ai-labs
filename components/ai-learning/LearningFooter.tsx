import Link from 'next/link'

export function LearningFooter() {
  return (
    <footer className="mt-20 border-t bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h3 className="font-semibold">Ravi Gupta AI Labs</h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            AI Learning explains core AI concepts through simple visual lessons,
            practical examples and lightweight quizzes.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/ai-learning" className="hover:text-foreground">
            AI Learning
          </Link>

          <Link href="/ai-learning/ai-basics" className="hover:text-foreground">
            AI Basics
          </Link>

          <Link
            href="/ai-learning/large-language-models"
            className="hover:text-foreground"
          >
            LLMs
          </Link>

          <Link href="/ai-learning/rag" className="hover:text-foreground">
            RAG
          </Link>
        </div>
      </div>
    </footer>
  )
}