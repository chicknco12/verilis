'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Sparkles, Building2, Briefcase, Target, Cpu, TrendingUp, ArrowUpRight,
  ChevronDown, Rocket,
} from 'lucide-react'
import { content } from '@/lib/virellis/content'

const PURPLE = '#2563EB'
const PURPLE_LIGHT = '#3B82F6'
const GOLD = '#4F46E5'

function accentTokens(accent) {
  if (accent === 'gold') {
    return { dot: GOLD, glow: 'rgba(79,70,229,0.28)', ring: 'rgba(79,70,229,0.25)', text: 'text-[#4F46E5]' }
  }
  return { dot: PURPLE, glow: 'rgba(37,99,235,0.22)', ring: 'rgba(37,99,235,0.22)', text: 'text-[#2563EB]' }
}

function Milestone({ m, index, isLast }) {
  const [open, setOpen] = useState(false)
  const side = index % 2 === 0 // even -> left, odd -> right (desktop)
  const a = accentTokens(m.accent)

  return (
    <div className="relative">
      {/* Node on the central line */}
      <div className="absolute left-4 md:left-1/2 top-6 md:-translate-x-1/2 z-20">
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full animate-ping-slow"
            style={{ background: a.dot, opacity: 0.5 }}
          />
          <span
            className="relative h-4 w-4 rounded-full border"
            style={{ background: a.dot, borderColor: '#FFFFFF', boxShadow: `0 0 18px 3px ${a.glow}` }}
          />
        </span>
      </div>

      {/* Card wrapper: offset to one side on desktop */}
      <div
        className={`relative pl-12 md:pl-0 pb-14 md:pb-20 ${
          side ? 'md:pr-[calc(50%+2.5rem)]' : 'md:pl-[calc(50%+2.5rem)]'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`group relative overflow-hidden rounded-2xl border p-6 md:p-7 backdrop-blur-xl transition-all duration-500`}
          style={{
            background: '#FFFFFF',
            borderColor: 'rgba(15,23,42,0.08)',
            boxShadow: '0 8px 40px rgba(15,23,42,0.06)',
          }}
        >
          {/* accent glow corner */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[70px] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: a.glow }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase" style={{ color: a.dot }}>
              <span className="h-px w-6" style={{ background: a.dot }} />
              {m.era}
            </div>

            <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white">
              {m.company}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1.5 text-white/70">
                <Briefcase className="h-3.5 w-3.5" style={{ color: a.dot }} /> {m.role}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/50">
                <Building2 className="h-3.5 w-3.5" /> {m.industry}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/65">{m.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {m.focus.slice(0, 4).map((f) => (
                <span
                  key={f}
                  className="rounded-full border px-2.5 py-1 text-[11px] text-ink/70"
                  style={{ borderColor: a.ring, background: 'rgba(37,99,235,0.04)' }}
                >
                  {f}
                </span>
              ))}
            </div>

            {/* Metrics preview */}
            {m.metrics && (
              <div className="mt-5 grid grid-cols-3 gap-2">
                {m.metrics.map((mt) => (
                  <div key={mt.k} className="rounded-xl border border-white/8 bg-white/[0.02] p-2.5 text-center">
                    <div className="font-display text-base font-semibold" style={{ color: a.dot }}>{mt.v}</div>
                    <div className="mt-0.5 text-[10px] leading-tight text-white/45">{mt.k}</div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-5 inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
            >
              {open ? 'Close' : 'Step inside'}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 space-y-4 border-t border-white/8 pt-5">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-white/40">
                        <Target className="h-3 w-3" /> THE CHALLENGE
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/70">{m.challenge}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-white/40">
                        <Cpu className="h-3 w-3" /> CAPABILITIES
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.technologies.map((t) => (
                          <span key={t} className="rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-white/60">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-white/40">
                        <TrendingUp className="h-3 w-3" /> OUTCOMES
                      </div>
                      <ul className="mt-1.5 space-y-1.5">
                        {m.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: a.dot }} />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function TransformationJourney() {
  const j = content.journey
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start center', 'end center'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div>
      {/* Timeline track */}
      <div ref={trackRef} className="relative mt-14">
        {/* base line */}
        <div className="absolute left-[1.4rem] md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 bg-white/8" />
        {/* animated draw line */}
        <motion.div
          className="absolute left-[1.4rem] md:left-1/2 top-0 w-px md:-translate-x-1/2 origin-top"
          style={{
            height: lineHeight,
            background: `linear-gradient(to bottom, ${PURPLE_LIGHT}, ${PURPLE}, ${GOLD})`,
            boxShadow: `0 0 16px 1px ${PURPLE}`,
          }}
        />

        <div className="relative">
          {j.milestones.map((m, i) => (
            <Milestone key={m.id} m={m} index={i} isLast={i === j.milestones.length - 1} />
          ))}
        </div>
      </div>

      {/* Future roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-8 overflow-hidden rounded-[1.75rem] border p-8 md:p-12"
        style={{ background: 'radial-gradient(120% 140% at 50% 0%, rgba(37,99,235,0.10) 0%, rgba(248,250,252,0.9) 45%, rgba(255,255,255,1) 100%)', borderColor: 'rgba(15,23,42,0.08)', boxShadow: '0 8px 40px rgba(15,23,42,0.06)' }}
      >
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#2563EB]/12 blur-[90px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#4F46E5]/10 blur-[90px]" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.4em] text-[#2563EB]">
            <Rocket className="h-3.5 w-3.5" /> {j.future.eyebrow}
          </div>
          <h3 className="mt-5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-ink">
            {j.future.title}
          </h3>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {j.future.items.map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-paper px-4 py-2 text-sm text-ink/80 shadow-sm transition-all hover:border-[#2563EB]/60 hover:text-ink hover:shadow-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
