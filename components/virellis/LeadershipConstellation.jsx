'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { content } from '@/lib/virellis/content'

export default function LeadershipConstellation() {
  const { nodes, edges } = content.leadership
  const [active, setActive] = useState(0)
  const a = nodes[active]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7">
        <div className="relative w-full aspect-[16/10] rounded-2xl glass overflow-hidden">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-electric/10 blur-[80px]" />
          <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-gold/10 blur-[80px]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {edges.map(([i, j], k) => {
              const on = i === active || j === active
              return (
                <line
                  key={k}
                  x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y}
                  stroke={on ? 'rgba(37,99,235,0.55)' : 'rgba(15,23,42,0.10)'}
                  strokeWidth={on ? 1.1 : 0.6}
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: 'stroke 0.4s ease' }}
                />
              )
            })}
          </svg>
          {nodes.map((n, i) => {
            const isA = i === active
            return (
              <button
                key={n.name}
                onClick={() => setActive(i)}
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <span className="relative flex items-center justify-center">
                  {isA && <span className="absolute h-7 w-7 rounded-full bg-gold/30 blur-md" />}
                  <span
                    className="relative rounded-full transition-all"
                    style={{
                      height: isA ? 14 : 10,
                      width: isA ? 14 : 10,
                      background: isA ? '#2563EB' : 'rgba(15,23,42,0.28)',
                      boxShadow: isA ? '0 0 16px rgba(37,99,235,0.55)' : 'none',
                    }}
                  />
                </span>
                <span className={`whitespace-nowrap text-[10px] md:text-xs transition-colors ${isA ? 'text-gold' : 'text-white/50 group-hover:text-white/85'}`}>
                  {n.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="lg:col-span-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-7 md:p-8"
          >
            <div className="text-[11px] tracking-[0.3em] text-gold/80">{a.name.toUpperCase()}</div>
            <h3 className="font-display mt-3 text-xl md:text-2xl font-semibold tracking-tight">{a.principle}</h3>
            <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-muted-foreground">{a.story}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
