'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Compass, ShieldCheck, Sparkles, Rocket, Database, Cloud, LayoutDashboard, Lightbulb,
} from 'lucide-react'

export const ICONS = { Compass, ShieldCheck, Sparkles, Rocket, Database, Cloud, LayoutDashboard, Lightbulb }

export function Counter({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const dur = 1700
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setN(value * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])
  const disp = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString()
  return <span ref={ref}>{prefix}{disp}{suffix}</span>
}

export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function PageHeader({ eyebrow, title, subtitle, center = false }) {
  return (
    <section className="relative pt-36 md:pt-44 pb-8">
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0) 72%)' }} />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
          <p className="text-[11px] tracking-[0.45em] text-gold/80">{eyebrow}</p>
          <h1 className="font-display mt-5 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">{title}</h1>
          {subtitle && (
            <p className={`mt-6 text-muted-foreground leading-relaxed ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{subtitle}</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
