'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Layers, ArrowRight } from 'lucide-react'
import { content } from '@/lib/virellis/content'

export default function DeliveryFramework() {
  const stages = content.framework.stages
  const [active, setActive] = useState(0)
  const s = stages[active]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Stage rail */}
      <div className="lg:col-span-5">
        <div className="space-y-1">
          {stages.map((st, i) => {
            const done = i <= active
            const isActive = i === active
            return (
              <button
                key={st.name}
                onClick={() => setActive(i)}
                className={`group relative flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors ${isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'}`}
              >
                {/* spine */}
                <div className="relative flex flex-col items-center">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all"
                    style={{
                      borderColor: done ? 'rgba(200,169,106,0.6)' : 'rgba(255,255,255,0.12)',
                      color: done ? '#E4CE9B' : 'rgba(255,255,255,0.4)',
                      background: isActive ? 'rgba(200,169,106,0.12)' : 'transparent',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {i < stages.length - 1 && (
                    <span
                      className="absolute top-8 h-[calc(100%_+_0.25rem)] w-px"
                      style={{ background: i < active ? 'rgba(200,169,106,0.5)' : 'rgba(255,255,255,0.08)' }}
                    />
                  )}
                </div>
                <span className="min-w-0">
                  <span className={`block text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>{st.name}</span>
                </span>
                <ArrowRight className={`ml-auto h-4 w-4 shrink-0 transition-all ${isActive ? 'text-gold opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div className="lg:col-span-7">
        <div className="glass rounded-2xl p-7 md:p-9 min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-[11px] tracking-[0.35em] text-gold/80">
                STAGE {String(active + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
              </div>
              <h3 className="font-display mt-3 text-2xl md:text-3xl font-semibold tracking-tight">{s.name}</h3>
              <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">{s.summary}</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="text-[11px] tracking-[0.3em] text-white/40">KEY DELIVERABLES</div>
                  <ul className="mt-3 space-y-2.5">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] tracking-[0.3em] text-white/40">FRAMEWORKS APPLIED</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.frameworks.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/75">
                        <Layers className="h-3 w-3 text-electric" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
