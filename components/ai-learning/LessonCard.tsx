import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'

import type { Lesson } from '@/lib/ai-learning/lessons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface LessonCardProps {
  lesson: Lesson
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card className="group h-full overflow-hidden rounded-3xl border bg-card/90 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-3xl">
            {lesson.icon}
          </div>

          <Badge variant="secondary" className="rounded-full">
            {lesson.difficulty}
          </Badge>
        </div>

        <h3 className="text-xl font-semibold tracking-tight">
          {lesson.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
          {lesson.description}
        </p>

        <div className="mt-6 flex items-center gap-2 border-t pt-5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {lesson.duration}
        </div>

        <Link
          href={lesson.href}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start lesson
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  )
}