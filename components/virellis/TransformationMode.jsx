'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, Zap } from 'lucide-react'

const TILES = [
  { k: 'Programmes rescued', v: '12' },
  { k: 'Steering decks survived', v: '400+' },
  { k: 'RAID items closed', v: '2,910' },
  { k: 'Red turned green', v: 'Several' },
  { k: 'Board confidence', v: 'Restored' },
  { k: 'Scope creep defeated', v: 'Repeatedly' },
  { k: 'Coffee', v: 'Strategic asset' },
  { k: 'Delivery mode', v: 'Engaged' },
]

export default function TransformationMode({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto px-4 py-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
    >
      <div className="fixed inset-0 bg-graphite-950/92 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        className="relative z-10 w-full max-w-3xl rounded-[1.75rem] glass p-8 md:p-12 text-center"
        initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gold/25 blur-[100px]" />
        <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-electric/25 blur-[100px]" />
        <button onClick={onClose} className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-gold/40 hover:text-gold" aria-label="Close">
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[11px] tracking-[0.35em] text-gold"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-3.5 w-3.5" /> SECRET UNLOCKED
          </motion.div>

          <h2 className="font-display mt-6 text-3xl md:text-5xl font-semibold tracking-tight text-gold-gradient">
            Transformation Mode
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm md:text-base text-muted-foreground leading-relaxed">
            You found the war room. The real metrics leadership never puts on a slide, and the ones that actually win programmes.
          </p>

          <div className="mt-9 grid grid-cols-2 md:grid-cols-4 gap-3">
            {TILES.map((t, i) => (
              <motion.div
                key={t.k}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="font-display text-lg md:text-xl font-semibold text-gold">{t.v}</div>
                <div className="mt-1 text-[11px] leading-snug text-muted-foreground">{t.k}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-9 flex items-center justify-center gap-2 text-xs text-white/40">
            <Zap className="h-3.5 w-3.5 text-gold" />
            <span className="tracking-[0.3em]">{'\u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192 B A'}</span>
          </div>

          <button onClick={onClose} className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium">
            Back to the headquarters
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
