'use client'

import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; r: number; phase: number; speed: number; vx: number; vy: number; color: string }

const COLORS = ['255, 246, 220', '232, 196, 110', '181, 239, 230', '200, 186, 255']

// Hero starfield: slow-drifting, twinkling stars on a canvas. Starts after
// the page is idle (never competes with the hero image), runs at ~30 fps,
// pauses when the hero is off-screen or the tab is hidden, and draws one
// still frame for visitors who prefer reduced motion. Decorative only.
export function Starfield({ className = '' }: { className?: string }): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = 0
    let height = 0
    let stars: Star[] = []
    let raf = 0
    let last = 0
    let onScreen = true
    let started = false

    function resize(): void {
      if (!canvas || !ctx) return
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(170, Math.max(60, (width * height) / 5200)))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() < 0.08 ? Math.random() * 1.2 + 1.2 : Math.random() * 1 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0015 + 0.0005,
        vx: (Math.random() - 0.5) * 0.06,
        vy: -(Math.random() * 0.1 + 0.02),
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0]!,
      }))
      draw(performance.now())
    }

    function draw(time: number): void {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (const s of stars) {
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.phase + time * s.speed))
        if (s.r > 1.2) {
          ctx.fillStyle = `rgba(${s.color}, ${alpha * 0.15})`
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function step(dt: number): void {
      for (const s of stars) {
        s.x += s.vx * dt * 0.06
        s.y += s.vy * dt * 0.06
        if (s.y < -4) s.y = height + 4
        if (s.x < -4) s.x = width + 4
        if (s.x > width + 4) s.x = -4
      }
    }

    function loop(now: number): void {
      raf = requestAnimationFrame(loop)
      const dt = now - last
      if (dt < 33) return
      last = now
      step(Math.min(dt, 100))
      draw(now)
    }

    function play(): void {
      if (reduceMotion || !started || !onScreen || document.hidden || raf !== 0) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    function pause(): void {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? false
      if (onScreen) play()
      else pause()
    })
    const ro = new ResizeObserver(() => resize())
    function onVisibility(): void {
      if (document.hidden) pause()
      else play()
    }

    function start(): void {
      started = true
      resize()
      ro.observe(canvas as HTMLCanvasElement)
      io.observe(canvas as HTMLCanvasElement)
      document.addEventListener('visibilitychange', onVisibility)
      play()
    }

    // requestIdleCallback is missing in older Safari; fall back to a short delay.
    let idleId: number | undefined
    let timerId: number | undefined
    if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(start, { timeout: 1500 })
    else timerId = window.setTimeout(start, 700)

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timerId !== undefined) window.clearTimeout(timerId)
      pause()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
