'use client'

import { useEffect, useRef } from 'react'

export function PortfolioAtmosphere() {
  const progressRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    const updatePointer = (event) => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', `${event.clientX}px`)
        root.style.setProperty('--pointer-y', `${event.clientY}px`)
      })
    }

    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`
      }
    }

    window.addEventListener('pointermove', updatePointer, { passive: true })
    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  return (
    <div className="cinematic-atmosphere" aria-hidden="true">
      <div className="cinematic-aurora cinematic-aurora-one" />
      <div className="cinematic-aurora cinematic-aurora-two" />
      <div className="cinematic-spotlight" />
      <div className="cinematic-vignette" />
      <div className="cinematic-noise" />
      <div ref={progressRef} className="cinematic-progress" />
    </div>
  )
}
