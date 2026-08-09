'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  PROFILE,
  ABOUT,
  STATS,
  SKILLS,
  CERTIFICATIONS,
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
  Bot,
  GanttChartSquare,
  Cpu,
  Mail,
  Linkedin,
  Download,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  Star,
} from 'lucide-react'

const ICONS = {
  BadgeCheck,
  Cloud,
  Users,
}

function Nav() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'AI EventOps', href: '#eventops' },
    { label: 'Projects', href: '#projects' },
    { label: 'Articles', href: '/articles' },
    { label: 'Useful Tools', href: '/tools' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
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

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) =>
            link.href.startsWith('/') ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 transition hover:text-cyan-400"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 transition hover:text-cyan-400"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-white/5 hover:text-white"
            >
              Sign in
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              size="sm"
              className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
              Launch AI Demo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-slate-950 px-5 py-4 md:hidden">
          {links.map((link) =>
            link.href.startsWith('/') ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-slate-300 transition hover:text-cyan-400"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-slate-300 transition hover:text-cyan-400"
              >
                {link.label}
              </a>
            )
          )}

          <div className="mt-4 grid gap-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-slate-700 bg-white/5 text-white"
              >
                Sign in
              </Button>
            </Link>

            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <Button className="w-full bg-cyan-400 text-slate-950">
                Launch AI Demo
              </Button>
            </Link>
          </div>
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="animate-fade-up">
          <Badge className="mb-5 gap-1.5 border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
            <MapPin className="h-3.5 w-3.5" />
            {PROFILE.location} • {PROFILE.status}
          </Badge>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
            Ravi Gupta
          </h1>

          <p className="mt-4 bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-lg font-semibold text-transparent md:text-2xl">
            {PROFILE.tagline}
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
            {PROFILE.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                View AI EventOps Demo
              </Button>
            </Link>

            <Link href="/tools">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 bg-white/5 text-white hover:bg-white/10"
              >
                Explore QA Tools
              </Button>
            </Link>

            <Link href="/articles">
              <Button
                size="lg"
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                Read Articles
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            Currently {PROFILE.currentRole}
          </div>
        </div>

        <div className="relative mx-auto">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-cyan-500/30 to-violet-500/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto h-72 w-72 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-cyan-500/10 md:h-96 md:w-80">
              <img
                src={PROFILE.photo}
                alt="Ravi Gupta"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -left-6 top-10 animate-float rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur md:-left-12">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/15 text-cyan-300">
                  <BadgeCheck className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    ISTQB
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Test Manager
                  </p>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-4 bottom-10 animate-float rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur md:-right-10"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-400/15 text-violet-300">
                  <Bot className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    AI Builder
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Human-in-loop
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
            <p className="font-display text-3xl font-bold text-white md:text-4xl">
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
  return (
    <section
      id="about"
      className="border-t border-white/5 py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <img
              src="https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Quality engineering dashboard"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-5 -right-5 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-xl">
            <p className="font-display text-2xl font-bold text-cyan-400">
              19+ yrs
            </p>
            <p className="text-xs text-slate-400">
              Quality engineering
            </p>
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            About
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Delivery leadership meets hands-on engineering
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

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              'SAP WMS/TMS/EWM',
              'Playwright',
              'CI/CD',
              'AI Governance',
              'Selenium',
              'Rest Assured',
              'TOSCA',
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
            Key skills
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((skill) => (
            <div
              key={skill.group}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.05]"
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

function EventOps() {
  const features = [
    {
      icon: MessagesSquare,
      title: 'AI Customer Enquiry Assistant',
      desc: 'WhatsApp-style inbox with grounded AI draft replies and confidence scoring.',
    },
    {
      icon: ShieldCheck,
      title: 'Human-in-the-loop Approvals',
      desc: 'AI never auto-sends. Every reply is reviewed, with risk levels and audit logs.',
    },
    {
      icon: Sparkles,
      title: 'AI Content Generator',
      desc: 'Generate social posts, reel scripts, emails and FAQ pages per event.',
    },
    {
      icon: GanttChartSquare,
      title: 'Smart Lead Capture (CRM)',
      desc: 'Auto-classify enquiries into a sales pipeline: hot leads, sponsors, vendors.',
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
            Featured AI Application
          </Badge>

          <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
            AI EventOps Assistant
          </h2>

          <p className="mt-4 text-lg text-slate-300">
            A production-style SaaS for event organisers — AI-drafted customer
            replies, human-in-the-loop approvals, lead capture and content
            generation, built with the test governance of an AI Test Manager.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
                  <feature.icon className="h-5 w-5" />
                </span>

                <h3 className="mt-4 font-display text-base font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-cyan-500/10">
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="AI EventOps Assistant"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:opacity-90"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Launch the live demo — no signup needed
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
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
        <div className="mb-12 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Portfolio
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Selected projects
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
                    Open demo
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

function Certifications() {
  return (
    <section className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Credentials
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Certifications
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CERTIFICATIONS.map((certification) => {
            const Icon = ICONS[certification.icon] || BadgeCheck

            return (
              <div
                key={certification.name}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 text-cyan-300">
                  <Icon className="h-6 w-6" />
                </span>

                <div>
                  <h3 className="font-display font-semibold text-white">
                    {certification.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {certification.issuer}
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

      toast.success('Thanks! Your message has been received.', {
        description:
          'Ravi will get back to you shortly. (Demo — Resend email wiring is a placeholder.)',
      })

      form.reset()
    }, 800)
  }

  return (
    <section
      id="contact"
      className="border-t border-white/5 py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Get in touch
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
            Let&apos;s build something with quality at its core
          </h2>

          <p className="mt-4 text-slate-300">
            Open to senior technology leadership, test management, and AI
            solution roles across New Zealand and Australia.
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
              LinkedIn profile
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
              placeholder="Company / role"
              className="border-slate-700 bg-slate-900/60 text-white placeholder:text-slate-500"
            />

            <Textarea
              required
              rows={4}
              placeholder="How can Ravi help?"
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
    <footer
      id="resume"
      className="border-t border-white/5 py-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-display text-xs font-bold text-slate-950">
            RG
          </span>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Ravi Gupta — ravigupta.dev
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <a
            href="#about"
            className="hover:text-cyan-400"
          >
            About
          </a>

          <Link
            href="/dashboard"
            className="hover:text-cyan-400"
          >
            AI Demo
          </Link>

          <Link
            href="/articles"
            className="hover:text-cyan-400"
          >
            Articles
          </Link>

          <Link
            href="/tools"
            className="hover:text-cyan-400"
          >
            Useful Tools
          </Link>

          <Link
            href="/login"
            className="hover:text-cyan-400"
          >
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans text-white selection:bg-cyan-400/30">
      <Nav />
      <Hero />
      <About />
      <Skills />
      <EventOps />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  )
}

export default App