'use client'

import { useEffect, useRef, useState } from 'react'

const FLOW = [
  'Context',
  'Grounding',
  'AI',
  'Confidence',
  'Risk',
  'Human Approval',
  'Audit',
  'Action',
]

const LABS = [
  ['EventPilot AI', 'Human-approved event workflows'],
  ['TestPilot AI', 'AI-assisted software testing'],
  ['RequirementPilot AI', 'Requirements and traceability'],
  ['DefectPilot AI', 'Defect intelligence and triage'],
  ['MCP Studio', 'Typed tools for future agents'],
  ['Voice Copilot', 'Intent routing with human control'],
]

export function CinematicDirector() {
  const canvasRef = useRef(null)
  const introRef = useRef(null)
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setIntroDone(true)
      return
    }

    const introTimer = window.setTimeout(() => setIntroDone(true), 3900)
    return () => window.clearTimeout(introTimer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = canvas.getContext('2d')
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    let pointerX = 0.5
    let pointerY = 0.5
    const particles = Array.from({ length: 72 }, (_, index) => ({
      x: ((index * 47) % 97) / 97,
      y: ((index * 71) % 89) / 89,
      z: 0.2 + ((index * 29) % 70) / 100,
      speed: 0.0007 + ((index * 13) % 11) / 7000,
    }))

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const pointer = (event) => {
      pointerX = event.clientX / Math.max(1, width)
      pointerY = event.clientY / Math.max(1, height)
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height)
      const scroll = window.scrollY
      const driftX = (pointerX - 0.5) * 30
      const driftY = (pointerY - 0.5) * 22

      for (const p of particles) {
        p.y -= p.speed * (1 + p.z)
        if (p.y < -0.03) p.y = 1.03

        const x = p.x * width + driftX * p.z
        const y = p.y * height + driftY * p.z - (scroll * 0.025 * p.z) % height
        const radius = 0.7 + p.z * 1.4
        const alpha = 0.08 + p.z * 0.28
        ctx.beginPath()
        ctx.fillStyle = `rgba(103, 232, 249, ${alpha})`
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      const pulse = 0.5 + Math.sin(time * 0.0012) * 0.15
      const gradient = ctx.createRadialGradient(
        width * (0.58 + (pointerX - 0.5) * 0.06),
        height * (0.42 + (pointerY - 0.5) * 0.04),
        0,
        width * 0.58,
        height * 0.42,
        Math.max(width, height) * 0.48,
      )
      gradient.addColorStop(0, `rgba(34, 211, 238, ${0.05 + pulse * 0.03})`)
      gradient.addColorStop(0.55, 'rgba(59, 130, 246, 0.018)')
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', pointer, { passive: true })
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', pointer)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="cinematic-particle-canvas" aria-hidden="true" />

      {!introDone && (
        <div ref={introRef} className="cinematic-intro" aria-hidden="true">
          <div className="cinematic-intro-grid" />
          <div className="cinematic-intro-copy">
            <p className="cinematic-intro-kicker">RAVI GUPTA · AI LABS</p>
            <div className="cinematic-intro-name" data-text="RAVI GUPTA">RAVI GUPTA</div>
            <p className="cinematic-intro-role">QUALITY ENGINEERING · APPLIED AI · HUMAN CONTROL</p>
            <div className="cinematic-intro-rule"><span /></div>
          </div>
          <div className="cinematic-intro-scan" />
        </div>
      )}
    </>
  )
}

export function AILabsUniverse() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return

    let raf = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      const travel = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      stage.style.setProperty('--lab-progress', progress.toFixed(4))
      raf = 0
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="ai-universe-section" aria-label="Ravi Gupta AI Labs architecture">
      <div ref={stageRef} className="ai-universe-stage">
        <div className="ai-universe-header">
          <p>Ravi Gupta AI Labs</p>
          <h2>One platform. Multiple AI capabilities.</h2>
          <span>Build once. Reuse everywhere.</span>
        </div>

        <div className="ai-universe-orbit" aria-hidden="true">
          <div className="ai-universe-core">
            <strong>RG</strong>
            <small>AI LABS</small>
          </div>
          <span className="orbit-ring orbit-ring-a" />
          <span className="orbit-ring orbit-ring-b" />
          <span className="orbit-beam orbit-beam-a" />
          <span className="orbit-beam orbit-beam-b" />
        </div>

        <div className="ai-universe-nodes">
          {LABS.map(([title, text], index) => (
            <article key={title} className={`ai-universe-node node-${index + 1}`}>
              <span className="ai-node-index">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="ai-universe-caption">
          <span>Shared auth</span><span>AI service layer</span><span>Governance</span><span>Audit</span><span>MCP</span><span>Testing</span>
        </div>
      </div>
    </section>
  )
}

export function GovernanceFlowScene() {
  return (
    <section className="governance-cinema" aria-label="AI governance workflow">
      <div className="governance-cinema-inner">
        <div className="governance-copy">
          <p>AI governance</p>
          <h2>AI should earn the right to act.</h2>
          <span>Every high-impact workflow keeps context, confidence, risk and human control visible.</span>
        </div>

        <div className="governance-rail">
          <div className="governance-energy" aria-hidden="true" />
          {FLOW.map((item, index) => (
            <div className="governance-step" key={item} style={{ '--step': index }}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
