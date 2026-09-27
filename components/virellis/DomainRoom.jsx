'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, CheckCircle2, ArrowRight, Quote } from 'lucide-react'

export default function DomainRoom({ domain, onClose }) {
  const r = domain.room

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto overscroll-contain px-4 py-10 md:py-16"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        className="relative z-10 w-full max-w-4xl rounded-[1.75rem] glass p-7 md:p-12"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/15 blur-[90px]" />
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-gold/40 hover:text-gold"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          <div className="text-[11px] tracking-[0.35em] text-gold/80">ROOM {domain.n} · {domain.name.toUpperCase()}</div>
          <h2 className="font-display mt-3 text-2xl md:text-4xl font-semibold tracking-tight">{r.headline}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{domain.desc}</p>

          {/* About */}
          <div className="mt-8 space-y-3">
            {r.about.map((p, i) => (
              <p key={i} className="text-sm md:text-[15px] leading-relaxed text-foreground/85">{p}</p>
            ))}
          </div>

          {/* Approach */}
          <div className="mt-9">
            <div className="text-[11px] tracking-[0.3em] text-gold/80">OUR APPROACH</div>
            <div className="mt-3 space-y-3">
              {r.approach.map((p, i) => (
                <p key={i} className="text-sm md:text-[15px] leading-relaxed text-foreground/85">{p}</p>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="mt-9">
            <div className="text-[11px] tracking-[0.3em] text-gold/80">CHALLENGES WE SOLVE</div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {r.challenges.map((c, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-sm italic text-foreground/90">{'\u201C'}{c.q}{'\u201D'}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables + Audience */}
          <div className="mt-9 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="text-[11px] tracking-[0.3em] text-gold/80">WHAT WE DELIVER</div>
              <ul className="mt-4 space-y-2.5">
                {r.deliver.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.3em] text-gold/80">WHO THIS IS FOR</div>
              <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-foreground/85">{r.audience}</p>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-10 rounded-2xl border border-gold/20 bg-gold/[0.04] p-6">
            <Quote className="h-5 w-5 text-gold/70" />
            <p className="mt-3 font-display text-lg md:text-xl font-medium leading-relaxed text-foreground/90">{r.quote}</p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs text-white/35">Virellis Transformation Studio</span>
            <button onClick={onClose} className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
              Close room <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
