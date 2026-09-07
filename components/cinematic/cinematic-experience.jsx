'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Braces,
  CheckCircle2,
  Cpu,
  FlaskConical,
  Gauge,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from 'lucide-react'
import { PROFILE, PROJECTS, STATS } from '@/lib/brand'

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function useSectionProgress(ref) {
  useEffect(() => {
    const node = ref.current
    if (!node) return

    let raf = 0

    const update = () => {
      raf = 0
      const rect = node.getBoundingClientRect()
      const travel = Math.max(1, rect.height - window.innerHeight)
      const progress = clamp(-rect.top / travel)
      node.style.setProperty('--hero-progress', progress.toFixed(4))
      node.style.setProperty('--time-progress', progress.toFixed(4))
      node.style.setProperty('--project-progress', progress.toFixed(4))
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref])
}

function ParticleField({ hostRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let pointerX = 0
    let pointerY = 0

    const particles = Array.from({ length: 76 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      size: 0.4 + Math.random() * 1.4,
      speed: 0.0007 + Math.random() * 0.0017,
      phase: index * 0.7 + Math.random() * 5,
    }))

    const resize = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onPointerMove = (event) => {
      const rect = host.getBoundingClientRect()
      pointerX = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1) - 0.5
      pointerY = clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1) - 0.5
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height)

      const gradient = ctx.createRadialGradient(
        width * (0.62 + pointerX * 0.03),
        height * (0.48 + pointerY * 0.02),
        0,
        width * 0.58,
        height * 0.5,
        width * 0.52,
      )
      gradient.addColorStop(0, 'rgba(34,211,238,.08)')
      gradient.addColorStop(0.42, 'rgba(59,130,246,.025)')
      gradient.addColorStop(1, 'rgba(2,6,23,0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      particles.forEach((particle) => {
        particle.y -= particle.speed
        if (particle.y < -0.04) {
          particle.y = 1.04
          particle.x = Math.random()
        }

        const depth = 0.35 + particle.z * 0.9
        const drift = Math.sin(time * 0.00035 + particle.phase) * 7 * depth
        const x = particle.x * width + drift + pointerX * 22 * depth
        const y = particle.y * height + pointerY * 12 * depth
        const alpha = 0.08 + particle.z * 0.32

        ctx.beginPath()
        ctx.arc(x, y, particle.size * depth, 0, Math.PI * 2)
        ctx.fillStyle = particle.z > 0.72
          ? `rgba(103,232,249,${alpha})`
          : `rgba(148,163,184,${alpha * 0.65})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    host.addEventListener('pointermove', onPointerMove)
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      host.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(raf)
    }
  }, [hostRef])

  return <canvas ref={canvasRef} className="cinema-hero-canvas" aria-hidden="true" />
}

export function CinematicHero() {
  const sectionRef = useRef(null)
  useSectionProgress(sectionRef)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onPointerMove = (event) => {
      const rect = section.getBoundingClientRect()
      const mx = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1) - 0.5
      const my = clamp((event.clientY - rect.top) / Math.max(window.innerHeight, 1), 0, 1) - 0.5
      section.style.setProperty('--hero-mx', mx.toFixed(4))
      section.style.setProperty('--hero-my', my.toFixed(4))
    }

    section.addEventListener('pointermove', onPointerMove)
    return () => section.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <section ref={sectionRef} className="cinema-hero" aria-label="Ravi Gupta introduction">
      <div className="cinema-hero-stage">
        <ParticleField hostRef={sectionRef} />
        <div className="cinema-hero-grid" aria-hidden="true" />
        <div className="cinema-hero-blackout" aria-hidden="true" />

        <div className="cinema-hero-wordmark" aria-hidden="true">
          <span>RAVI</span>
          <span>GUPTA</span>
        </div>

        <div className="cinema-hero-person" aria-hidden="true">
          <div className="cinema-hero-rim" />
          <img src={PROFILE.photo} alt="" />
          <div className="cinema-person-scan" />
        </div>

        <div className="cinema-hero-copy">
          <p className="cinema-eyebrow">AUCKLAND · NEW ZEALAND · AI + QUALITY ENGINEERING</p>
          <h1>Quality engineering for the AI era.</h1>
          <p className="cinema-tagline">{PROFILE.tagline}</p>
          <p className="cinema-intro">{PROFILE.intro}</p>
          <div className="cinema-hero-actions">
            <Link href="/learning" className="cinema-primary-action">
              <FlaskConical /> Try the Learning Lab <ArrowRight />
            </Link>
            <Link href="/dashboard" className="cinema-secondary-action">
              <Sparkles /> Explore AI EventOps
            </Link>
          </div>
        </div>

        <div className="cinema-hero-chips" aria-hidden="true">
          <div className="cinema-chip cinema-chip-a">
            <ShieldCheck />
            <span>Quality Leadership</span>
            <small>19+ years</small>
          </div>
          <div className="cinema-chip cinema-chip-b">
            <Cpu />
            <span>Applied AI</span>
            <small>Governed workflows</small>
          </div>
          <div className="cinema-chip cinema-chip-c">
            <Network />
            <span>MCP-ready</span>
            <small>Agent capability layer</small>
          </div>
        </div>

        <div className="cinema-scroll-cue" aria-hidden="true">
          <span>SCROLL TO ENTER</span>
          <i />
        </div>

        <div className="cinema-hero-stats">
          {STATS.map((stat, index) => (
            <div key={stat.label} style={{ '--stat-i': index }}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CAPABILITIES = [
  {
    code: '01',
    title: 'Quality Engineering',
    subtitle: 'Foundation',
    body: 'Risk-based testing, release evidence, governance and quality leadership across complex delivery environments.',
  },
  {
    code: '02',
    title: 'Enterprise Systems',
    subtitle: 'Integration',
    body: 'Quality strategy across integrated platforms, APIs, enterprise workflows and supply-chain technology.',
  },
  {
    code: '03',
    title: 'Automation',
    subtitle: 'Engineering',
    body: 'Reliable automation, CI/CD quality gates, Playwright, API validation and maintainable test architecture.',
  },
  {
    code: '04',
    title: 'Applied AI',
    subtitle: 'Now',
    body: 'AI-assisted workflows with grounding, confidence, risk controls, human approval, auditability and evaluation.',
  },
]

export function CapabilityTimeMachine() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(3)
  useSectionProgress(sectionRef)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const travel = Math.max(1, rect.height - window.innerHeight)
      const progress = clamp(-rect.top / travel)
      const next = Math.min(CAPABILITIES.length - 1, Math.floor(progress * CAPABILITIES.length))
      setActive(next)
      section.style.setProperty('--active', String(next))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const activateFromPointer = (event) => {
    if (window.innerWidth < 980) return
    const rect = event.currentTarget.getBoundingClientRect()
    const u = clamp((event.clientX - rect.left) / Math.max(1, rect.width))
    const next = Math.min(CAPABILITIES.length - 1, Math.round(u * (CAPABILITIES.length - 1)))
    setActive(next)
    sectionRef.current?.style.setProperty('--active', String(next))
  }

  return (
    <section ref={sectionRef} className="time-machine" onPointerMove={activateFromPointer} aria-label="Engineering journey">
      <div className="time-machine-stage">
        <div className="time-room" aria-hidden="true"><i /><i /><i /></div>

        <div className="time-copy">
          <p>ENGINEERING JOURNEY</p>
          <h2>From quality control to controlled intelligence.</h2>
        </div>

        <div className="time-clock" aria-hidden="true">
          <div className="time-clock-halo" />
          <div className="time-clock-pivot" />
          <div className="time-clock-hand" />
          <div className="time-clock-hand-secondary" />
        </div>

        <div className="time-active-label" aria-hidden="true">
          <span>{CAPABILITIES[active].code}</span>
          <strong>{CAPABILITIES[active].title}</strong>
        </div>

        <div className="time-rail">
          {CAPABILITIES.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`time-card ${active === index ? 'is-active' : ''}`}
              style={{ '--i': index }}
              onFocus={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
            >
              <span>{item.code}</span>
              <strong>{item.title}</strong>
              <em>{item.subtitle}</em>
              <p>{item.body}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProjectUniverseCinema() {
  const sectionRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  useSectionProgress(sectionRef)

  const projects = useMemo(() => PROJECTS.slice(0, 4), [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onPointerMove = (event) => {
      const rect = section.getBoundingClientRect()
      const mx = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1) - 0.5
      const my = clamp((event.clientY - Math.max(0, rect.top)) / Math.max(1, window.innerHeight), 0, 1) - 0.5
      section.style.setProperty('--project-mx', mx.toFixed(4))
      section.style.setProperty('--project-my', my.toFixed(4))
    }

    section.addEventListener('pointermove', onPointerMove)
    return () => section.removeEventListener('pointermove', onPointerMove)
  }, [])

  const icons = [Bot, TestTube2, ShieldCheck, Layers3]

  return (
    <section ref={sectionRef} className="project-universe-cinema" aria-label="Project universe">
      <div className="project-universe-stage">
        <div className="project-title">
          <p>RAVI GUPTA AI LABS</p>
          <h2>Business workflows become AI systems here.</h2>
          <span>Move through the scene. Each project is a working engineering direction, not a chatbot skin.</span>
        </div>

        <div className="project-floor" aria-hidden="true"><i /><i /><i /></div>

        <div className="project-avatar" aria-hidden="true">
          <div className="project-avatar-glow" />
          <img src={PROFILE.photo} alt="" />
        </div>

        <div className="project-deck">
          {projects.map((project, index) => {
            const Icon = icons[index] || Braces
            const isHovered = hovered === index
            const isMuted = hovered !== null && hovered !== index
            return (
              <Link
                key={project.title}
                href={project.href}
                className={`project-cinema-card project-cinema-card-${index + 1} ${isHovered ? 'is-hovered' : ''} ${isMuted ? 'is-muted' : ''}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
              >
                <div className="project-card-image">
                  <img src={project.image} alt="" />
                  <span>0{index + 1}</span>
                </div>
                <div className="project-card-copy">
                  <small>{project.category}</small>
                  <strong>{project.title}</strong>
                  <p>{project.description}</p>
                  <em><Icon /> Enter project <ArrowRight /></em>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
