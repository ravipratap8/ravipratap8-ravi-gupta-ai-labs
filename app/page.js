'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PortfolioAtmosphere } from '@/components/cinematic/portfolio-atmosphere'
import { SceneReveal } from '@/components/cinematic/scene-reveal'
import { AILabsUniverse, GovernanceFlowScene } from '@/components/cinematic/cinematic-director'
import { CapabilityTimeMachine, CinematicHero, ProjectUniverseCinema } from '@/components/cinematic/cinematic-experience'
import {
  PROFILE,
  ABOUT,
  STATS,
  SKILLS,
  EDUCATION,
  CERTIFICATIONS,
  LEARNING_MODULES,
  PROJECTS,
  HERO_BG,
} from '@/lib/brand'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  BadgeCheck,
  Cloud,
  Users,
  MessagesSquare,
  GanttChartSquare,
  Cpu,
  Mail,
  Linkedin,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  Star,
  FlaskConical,
  BrainCircuit,
  Code2,
  Network,
  GraduationCap,
  Layers3,
  Activity,
  ScrollText,
  ExternalLink,
  BookOpen,
  Clock3,
  FileText,
  Wrench,
  FileUp,
  FileDown,
} from 'lucide-react'

const ICONS = {
  BadgeCheck,
  Cloud,
  Users,
}

const LEARNING_ICONS = [
  BrainCircuit,
  Code2,
  Network,
]

const ARTICLES = [
  {
    category: 'API Testing',
    title: 'API Testing Beyond Status Codes: Testing the System Contract',
    description:
      'Why meaningful API testing goes far beyond checking 200 responses and must validate contracts, business rules, state transitions and failure behaviour.',
    href: '/articles/api-testing-beyond-status-codes-system-contracts',
    readTime: 'Quality Engineering',
    icon: Network,
  },
  {
    category: 'Production Quality',
    title: 'Tests Passed. Now Debug Production.',
    description:
      'Passing tests are only one source of evidence. Production observability, telemetry and runtime behaviour are equally important to release confidence.',
    href: '/articles/tests-passed-debug-production-observability',
    readTime: 'Observability',
    icon: Activity,
  },
  {
    category: 'AI & Quality Engineering',
    title: 'AI-Generated Code Changes the QA Trust Model',
    description:
      'When software can be generated faster than humans can validate it, quality engineering must move from execution volume towards evidence, risk and trust.',
    href: '/articles/ai-generated-code-qa-trust-quality-engineering',
    readTime: 'AI Engineering',
    icon: BrainCircuit,
  },
  {
    category: 'AI Governance',
    title: 'AI Agents, Human Control and Governance',
    description:
      'Agentic AI becomes useful when capability is matched with permissions, risk controls, human oversight and auditability.',
    href: '/articles/ai-agents-human-control-governance',
    readTime: 'AI Governance',
    icon: ShieldCheck,
  },
  {
    category: 'AI Testing',
    title: 'AI-Generated Tests: Who Tests the Tests?',
    description:
      'AI can generate test cases quickly, but generated volume is not the same as meaningful coverage, correctness or confidence.',
    href: '/articles/ai-generated-tests-who-tests-the-tests',
    readTime: 'Test Strategy',
    icon: Code2,
  },
]

function Nav() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'About', href: '#about' },
    { label: 'AI & QE', href: '#focus' },
    { label: 'Articles', href: '#articles' },
    { label: 'Learning Lab', href: '#learning' },
    { label: 'Tools', href: '#tools' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-slate-950/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-sm font-bold text-slate-950">
            RG
          </span>

          <div className="leading-tight">
            <p className="font-display text-sm font-bold text-white">
              Ravi Gupta
            </p>
            <p className="text-[11px] text-cyan-400">
              AI Labs
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/articles">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <BookOpen className="mr-1 h-4 w-4" />
              Articles
            </Button>
          </Link>

          <Link href="/learning">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <FlaskConical className="mr-1 h-4 w-4" />
              Learning
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              size="sm"
              className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
              Explore AI Demo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-slate-950 px-5 py-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-slate-300"
            >
              {link.label}
            </a>
          ))}

          <Link href="/articles">
            <Button
              variant="outline"
              className="mt-3 w-full border-slate-700 bg-white/5 text-white"
            >
              Read Articles
            </Button>
          </Link>

          <Link href="/learning">
            <Button
              variant="outline"
              className="mt-2 w-full border-slate-700 bg-white/5 text-white"
            >
              Open Learning Lab
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="mt-2 w-full bg-cyan-400 text-slate-950">
              Explore AI Demo
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="h-full w-full object-cover opacity-20"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-[1.15fr_.85fr]">
        <div>
          <Badge className="mb-5 gap-1.5 border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
            <MapPin className="h-3.5 w-3.5" />
            {PROFILE.location}
          </Badge>

          <h1 className="font-display text-5xl font-bold leading-[1.03] tracking-tight text-white md:text-7xl">
            Quality engineering for the AI era.
          </h1>

          <p className="mt-5 bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-lg font-semibold text-transparent md:text-2xl">
            {PROFILE.tagline}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            {PROFILE.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/learning">
              <Button
                size="lg"
                className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              >
                <FlaskConical className="mr-2 h-4 w-4" />
                Try the Learning Lab
              </Button>
            </Link>

            <Link href="/articles">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 bg-white/5 text-white hover:bg-white/10"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Read Articles
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 bg-white/5 text-white hover:bg-white/10"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Explore AI EventOps
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              {PROFILE.currentRole}
            </span>

            <span className="inline-flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-violet-300" />
              Master of Management in progress
            </span>
          </div>
        </div>

        <div className="relative mx-auto">
          <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-cyan-500/30 to-violet-500/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto h-80 w-72 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-cyan-500/10 md:h-[430px] md:w-80">
              <img
                src={PROFILE.photo}
                alt="Ravi Gupta"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -left-8 top-10 rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/15 text-cyan-300">
                  <BadgeCheck className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Quality Leadership
                  </p>
                  <p className="text-[10px] text-slate-400">
                    19+ years
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-12 rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-400/15 text-violet-300">
                  <BrainCircuit className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Applied AI
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Governed workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 px-5 md:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center"
          >
            <p className="font-display text-2xl font-bold text-white md:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function About() {
  const waysOfWorking = [
    [
      '1',
      'Understand the business risk',
      'Start with what can fail, who is affected and what evidence is needed.',
    ],
    [
      '2',
      'Design for testability and control',
      'Make system state, AI confidence, approvals, logs and interfaces observable.',
    ],
    [
      '3',
      'Automate the right things',
      'Use APIs, Playwright, CI/CD and reusable patterns where automation improves feedback.',
    ],
    [
      '4',
      'Keep humans in high-impact decisions',
      'AI can accelerate work without silently inheriting authority it should not have.',
    ],
  ]

  return (
    <section
      id="about"
      className="border-t border-white/5 py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[.85fr_1.15fr]">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-violet-400/5 p-7 md:p-9">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            How I work
          </p>

          <div className="mt-6 space-y-5">
            {waysOfWorking.map(([number, title, text]) => (
              <div
                key={number}
                className="flex gap-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 font-display font-bold text-cyan-300">
                  {number}
                </span>

                <div>
                  <p className="font-semibold text-white">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            About
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-5xl">
            Leadership experience, backed by hands-on engineering.
          </h2>

          <div className="mt-6 space-y-4 text-slate-300">
            {ABOUT.map((paragraph, index) => (
              <p
                key={index}
                className="leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {[
              'AI Governance',
              'Playwright',
              'API Testing',
              'SAP WMS/TMS/EWM',
              'CI/CD',
              'MCP',
              'Human-in-the-loop',
              'Test Strategy',
            ].map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-slate-700 bg-white/5 text-slate-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Focus() {
  const areas = [
    {
      icon: BrainCircuit,
      title: 'Applied AI Engineering',
      text: 'Design AI workflows around grounding, confidence, risk, safe fallback, human approval and auditable action.',
    },
    {
      icon: ShieldCheck,
      title: 'AI Quality & Governance',
      text: 'Evaluate behaviour, hallucination risk, prompt changes, model uncertainty and control effectiveness, not just whether the API responded.',
    },
    {
      icon: Code2,
      title: 'Modern Test Automation',
      text: 'Build maintainable Playwright and API automation around business outcomes, deterministic state and CI feedback.',
    },
    {
      icon: Layers3,
      title: 'Enterprise Quality Strategy',
      text: 'Connect functional, integration, automation, data and release evidence across complex delivery programmes.',
    },
    {
      icon: Activity,
      title: 'Observability & Release Confidence',
      text: 'Use test evidence and production signals together. A green pipeline is not proof that a system is healthy in production.',
    },
    {
      icon: ScrollText,
      title: 'MCP & Agent-ready Design',
      text: 'Shape business capabilities as controlled tools so future agents can act through explicit permissions and auditable interfaces.',
    },
  ]

  return (
    <section
      id="focus"
      className="border-t border-white/5 bg-white/[0.015] py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-3xl">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Current focus
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-5xl">
            Where AI engineering and quality engineering meet.
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            The interesting problem is no longer whether AI can generate an
            answer. It is whether the surrounding system can make that answer
            useful, testable, explainable and safe enough for the business
            context.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const Icon = area.icon

            return (
              <div
                key={area.title}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 transition hover:border-cyan-400/25"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {area.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {area.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section
      id="skills"
      className="border-t border-white/5 py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Capabilities
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Engineering breadth with a quality core
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill) => (
            <div
              key={skill.group}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/30"
            >
              <h3 className="font-display text-base font-semibold text-white">
                {skill.group}
              </h3>

              <ul className="mt-4 space-y-2.5">
                {skill.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Articles() {
  return (
    <section
      id="articles"
      className="border-t border-white/5 bg-white/[0.015] py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Badge className="mb-4 gap-1.5 border-violet-400/30 bg-violet-400/10 text-violet-300 hover:bg-violet-400/10">
              <BookOpen className="h-3.5 w-3.5" />
              Engineering Notes
            </Badge>

            <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
              Ideas from the intersection of AI, testing and engineering.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Practical observations on AI engineering, quality strategy,
              automation, APIs, governance and what changes when software
              systems become increasingly AI-assisted.
            </p>
          </div>

          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Browse all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ARTICLES.slice(0, 4).map((article, index) => {
            const Icon = article.icon

            return (
              <Link
                key={article.href}
                href={article.href}
                className={`group rounded-3xl border border-white/10 bg-slate-950/60 p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 ${
                  index === 0 ? 'md:col-span-2' : ''
                }`}
              >
                <div
                  className={
                    index === 0
                      ? 'grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center'
                      : ''
                  }
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </span>

                  <div className={index === 0 ? '' : 'mt-5'}>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                        {article.category}
                      </p>

                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3
                      className={`mt-2 font-display font-bold text-white ${
                        index === 0
                          ? 'text-2xl md:text-3xl'
                          : 'text-xl'
                      }`}
                    >
                      {article.title}
                    </h3>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
                      {article.description}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 font-semibold text-cyan-400 ${
                      index === 0
                        ? 'mt-5 text-sm md:mt-0'
                        : 'mt-6 text-sm'
                    }`}
                  >
                    Read
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/articles">
            <Button
              variant="outline"
              className="border-slate-700 bg-white/5 text-white hover:bg-white/10"
            >
              <FileText className="mr-2 h-4 w-4" />
              View all published articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Learning() {
  return (
    <section
      id="learning"
      className="border-t border-white/5 bg-gradient-to-b from-cyan-950/10 to-slate-950 py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Badge className="mb-4 gap-1.5 border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
              <FlaskConical className="h-3.5 w-3.5" />
              Interactive Learning Lab
            </Badge>

            <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
              Learn by making the decision.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Short, practical labs that teach the judgement behind AI
              governance, browser automation and API quality. No passive slide
              deck pretending to be learning.
            </p>
          </div>

          <Link
            href="/learning"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            View all modules
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {LEARNING_MODULES.map((module, index) => {
            const Icon = LEARNING_ICONS[index] || FlaskConical

            return (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-6 w-6" />
                </span>

                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                  {module.eyebrow}
                </p>

                <h3 className="mt-2 font-display text-xl font-bold text-white">
                  {module.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {module.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {module.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                  <span className="text-slate-500">
                    {module.lessons}
                  </span>

                  <span className="inline-flex items-center gap-1 font-semibold text-cyan-400">
                    Start
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}


function Tools() {
  const tools = [
    {
      icon: FileUp,
      eyebrow: 'Document Utility',
      title: 'Word to PDF',
      description:
        'Convert Word documents into clean PDF files directly from the browser. A simple utility for assignments, reports, CVs, business documents and everyday document sharing.',
      href: '/tools/word-to-pdf',
      tags: ['DOCX', 'PDF', 'Browser Tool'],
      action: 'Convert Word to PDF',
    },
    {
      icon: FileDown,
      eyebrow: 'Document Utility',
      title: 'PDF to Word',
      description:
        'Turn PDF documents into editable Word files when you need to reuse, revise or work with document content instead of starting again from scratch.',
      href: '/tools/pdf-to-word',
      tags: ['PDF', 'DOCX', 'Editable Output'],
      action: 'Convert PDF to Word',
    },
  ]

  return (
    <section
      id="tools"
      className="border-t border-white/5 bg-white/[0.015] py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Badge className="mb-4 gap-1.5 border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
              <Wrench className="h-3.5 w-3.5" />
              Useful Tools
            </Badge>

            <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
              Small tools that solve real everyday problems.
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              The portfolio is not only about reading and demonstrations.
              These free browser-based utilities are practical tools people
              can actually use. More engineering and productivity utilities
              can be added here over time without turning the site into a
              collection of gimmicks.
            </p>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            View all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-3xl border border-white/10 bg-slate-950/60 p-7 transition hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
                    Free to use
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                  {tool.eyebrow}
                </p>

                <h3 className="mt-2 font-display text-2xl font-bold text-white">
                  {tool.title}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-400">
                  {tool.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-slate-700 bg-transparent text-slate-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-semibold text-cyan-400">
                    {tool.action}
                  </span>

                  <ChevronRight className="h-5 w-5 text-cyan-400 transition group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400/5 to-violet-400/5 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-white">
                Practical utilities will keep growing.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Document tools are the starting point. The goal is to add
                useful engineering, testing and productivity utilities where
                they provide genuine value.
              </p>
            </div>

            <Link href="/tools">
              <Button
                variant="outline"
                className="shrink-0 border-slate-700 bg-white/5 text-white hover:bg-white/10"
              >
                <Wrench className="mr-2 h-4 w-4" />
                Explore Tools
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function EventOps() {
  const features = [
    {
      icon: MessagesSquare,
      title: 'Grounded AI Drafts',
      desc: 'AI assists with customer enquiries using workflow context rather than operating as an isolated chatbot.',
    },
    {
      icon: ShieldCheck,
      title: 'Human Approval',
      desc: 'High-impact output remains reviewable before action, with confidence and risk visible to the user.',
    },
    {
      icon: ScrollText,
      title: 'Auditability',
      desc: 'Prompt context, AI output, decision signals and human actions can be captured as evidence.',
    },
    {
      icon: GanttChartSquare,
      title: 'Workflow, not Chat',
      desc: 'AI is embedded into enquiry, approval, content and lead-management tasks with clear business state.',
    },
  ]

  return (
    <section
      id="eventops"
      className="border-t border-white/5 py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 max-w-3xl">
          <Badge className="mb-4 gap-1.5 border-violet-400/30 bg-violet-400/10 text-violet-300 hover:bg-violet-400/10">
            <Cpu className="h-3.5 w-3.5" />
            Working AI Demonstration
          </Badge>

          <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
            AI EventOps Assistant
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            A practical demonstration of how AI can improve a business workflow
            without being allowed to silently make every decision.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </span>

                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>

          <div>
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-cyan-500/10">
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="AI engineering workspace"
                className="h-full w-full object-cover"
              />
            </div>

            <Link href="/dashboard">
              <Button
                size="lg"
                className="mt-6 w-full bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:opacity-90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Explore the working demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section
      id="projects"
      className="border-t border-white/5 py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Build portfolio
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Working ideas, patterns and engineering demonstrations
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-cyan-400/30"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />

                {project.featured && (
                  <Badge className="absolute right-4 top-4 gap-1 border-0 bg-cyan-400 text-slate-950">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  {project.category}
                </p>

                <h3 className="mt-1.5 font-display text-xl font-bold text-white">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-slate-700 bg-transparent text-slate-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {project.href.startsWith('/') && (
                  <Link
                    href={project.href}
                    className="mt-5 inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Explore
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section
      id="education"
      className="border-t border-white/5 bg-white/[0.015] py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Education & development
            </p>

            <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-5xl">
              Still learning. Deliberately.
            </h2>

            <p className="mt-4 text-slate-300">
              Technical experience is strongest when it is combined with
              business judgement, communication and an understanding of how
              organisations actually make decisions.
            </p>
          </div>

          <div className="space-y-5">
            {EDUCATION.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 md:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-cyan-300" />

                      <h3 className="font-display text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-1 text-sm text-cyan-400">
                      {item.status}
                    </p>
                  </div>

                  <Badge className="border-violet-400/20 bg-violet-400/10 text-violet-300 hover:bg-violet-400/10">
                    {item.highlight}
                  </Badge>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Certifications() {
  return (
    <section className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Credentials
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Professional certifications
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CERTIFICATIONS.map((cert) => {
            const Icon = ICONS[cert.icon] || BadgeCheck

            return (
              <div
                key={cert.name}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 text-cyan-300">
                  <Icon className="h-6 w-6" />
                </span>

                <div>
                  <h3 className="font-display font-semibold text-white">
                    {cert.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {cert.issuer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sending, setSending] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()

    setSending(true)

    const form = event.currentTarget

    setTimeout(() => {
      setSending(false)

      toast.success(
        'Thanks. Your message has been received.',
        {
          description: 'Ravi will get back to you shortly.',
        }
      )

      form.reset()
    }, 700)
  }

  return (
    <section
      id="contact"
      className="border-t border-white/5 py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Connect
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Talk engineering, quality, AI or practical delivery.
          </h2>

          <p className="mt-4 text-slate-300">
            I use this site to share working ideas, experiments and lessons
            from quality engineering and applied AI.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={`mailto:${PROFILE.email}`}
              className="flex items-center gap-3 text-slate-300 hover:text-cyan-400"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                <Mail className="h-5 w-5" />
              </span>

              {PROFILE.email}
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-slate-300 hover:text-cyan-400"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                <Linkedin className="h-5 w-5" />
              </span>

              LinkedIn

              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <div className="flex items-center gap-3 text-slate-300">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                <MapPin className="h-5 w-5" />
              </span>

              {PROFILE.location}
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
        >
          <div className="grid gap-4">
            <Input
              required
              placeholder="Your name"
              className="border-slate-700 bg-slate-900/60 text-white placeholder:text-slate-500"
            />

            <Input
              required
              type="email"
              placeholder="Email address"
              className="border-slate-700 bg-slate-900/60 text-white placeholder:text-slate-500"
            />

            <Input
              placeholder="Company / area of interest"
              className="border-slate-700 bg-slate-900/60 text-white placeholder:text-slate-500"
            />

            <Textarea
              required
              rows={4}
              placeholder="What would you like to discuss?"
              className="border-slate-700 bg-slate-900/60 text-white placeholder:text-slate-500"
            />

            <Button
              type="submit"
              disabled={sending}
              size="lg"
              className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
              {sending ? 'Sending…' : 'Send message'}

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-xs font-bold text-slate-950">
            RG
          </span>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Ravi Gupta · AI Labs
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-400">
          <Link
            href="/articles"
            className="hover:text-cyan-400"
          >
            Articles
          </Link>

          <Link
            href="/learning"
            className="hover:text-cyan-400"
          >
            Learning Lab
          </Link>

          <Link
            href="/dashboard"
            className="hover:text-cyan-400"
          >
            AI Demo
          </Link>

          <a
            href="#projects"
            className="hover:text-cyan-400"
          >
            Projects
          </a>

          <a
            href="#about"
            className="hover:text-cyan-400"
          >
            About
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <main className="cinematic-home min-h-screen bg-slate-950 font-sans text-white selection:bg-cyan-400/30">
      <PortfolioAtmosphere />
      <Nav />

      <CinematicHero />
      <SceneReveal className="cinematic-scene" delay={60}>
        <About />
      </SceneReveal>

      <CapabilityTimeMachine />

      <SceneReveal className="cinematic-scene" delay={80}>
        <Focus />
      </SceneReveal>

      <AILabsUniverse />
      <GovernanceFlowScene />

      <SceneReveal className="cinematic-scene" delay={80}>
        <Skills />
      </SceneReveal>

      {/* Published writing remains a core part of the portfolio. */}
      <SceneReveal className="cinematic-scene" delay={80}>
        <Articles />
      </SceneReveal>

      {/* Interactive modules complement the articles rather than replacing them. */}
      <SceneReveal className="cinematic-scene" delay={80}>
        <Learning />
      </SceneReveal>

      {/* Useful browser utilities remain visible as a practical part of the portfolio. */}
      <SceneReveal className="cinematic-scene" delay={80}>
        <Tools />
      </SceneReveal>

      <SceneReveal className="cinematic-scene" delay={80}>
        <EventOps />
      </SceneReveal>

      <ProjectUniverseCinema />

      <SceneReveal className="cinematic-scene" delay={80}>
        <Projects />
      </SceneReveal>
      <SceneReveal className="cinematic-scene" delay={80}>
        <Education />
      </SceneReveal>
      <SceneReveal className="cinematic-scene" delay={80}>
        <Certifications />
      </SceneReveal>
      <SceneReveal className="cinematic-scene" delay={80}>
        <Contact />
      </SceneReveal>
      <Footer />
    </main>
  )
}
