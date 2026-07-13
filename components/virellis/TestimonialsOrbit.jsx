'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, X } from 'lucide-react'
import { content } from '@/lib/virellis/content'

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('')
}

function Card({ t, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-[340px] shrink-0 text-left rounded-2xl glass p-6 transition-colors hover:border-gold/30"
    >
      <Quote className="h-6 w-6 text-gold/60" />
      <p className="mt-4 text-sm leading-relaxed text-foreground/85 line-clamp-4">{t.quote}</p>
      <div className="mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xs font-semibold text-gold">
          {initials(t.name)}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{t.name}</span>
          <span className="block text-xs text-muted-foreground truncate">{t.role}, {t.org}</span>
        </span>
      </div>
    </button>
  )
}

export default function TestimonialsOrbit() {
  const items = content.testimonials.items
  const [active, setActive] = useState(null)
  const loop = [...items, ...items]

  return (
    <div className="group relative">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-graphite-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-graphite-950 to-transparent" />

      <div className="overflow-hidden">
        <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <Card key={i} t={t} onClick={() => setActive(t)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          >
            <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-md" onClick={() => setActive(null)} />
            <motion.div
              className="relative z-10 w-full max-w-2xl rounded-[1.5rem] glass p-8 md:p-10"
              initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/15 blur-[90px]" />
              <button
                onClick={() => setActive(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-gold/40 hover:text-gold"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative">
                <Quote className="h-8 w-8 text-gold/70" />
                <p className="mt-5 font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/95">{active.quote}</p>
                <div className="mt-7 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-sm font-semibold text-gold">
                    {initials(active.name)}
                  </span>
                  <span>
                    <span className="block font-medium text-foreground">{active.name}</span>
                    <span className="block text-sm text-muted-foreground">{active.role}, {active.org}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
