'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Landmark, ClipboardList, ShieldAlert, Map, Presentation, Megaphone, Gavel, X, ArrowUpRight,
} from 'lucide-react'
import { content } from '@/lib/virellis/content'

const ICONS = { FileText, Landmark, ClipboardList, ShieldAlert, Map, Presentation, Megaphone, Gavel }

function ArtifactModal({ a, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  const Icon = ICONS[a.icon] || FileText

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto px-4 py-10 md:py-16"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
    >
      <div className="fixed inset-0 bg-graphite-950/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-3xl rounded-[1.5rem] glass p-7 md:p-10"
        initial={{ opacity: 0, y: 34, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/15 blur-[90px]" />
        <button onClick={onClose} className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-gold/40 hover:text-gold" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[11px] tracking-[0.3em] text-gold/80">{a.tag}</div>
              <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight">{a.title}</h3>
            </div>
          </div>
          {a.summary && <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-foreground/85">{a.summary}</p>}

          {a.fields && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {a.fields.map((f) => (
                <div key={f.k} className="rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                  <div className="text-[10px] tracking-[0.25em] text-white/40">{f.k.toUpperCase()}</div>
                  <div className="mt-1 text-sm text-foreground/90">{f.v}</div>
                </div>
              ))}
            </div>
          )}

          {a.table && (
            <div className="mt-6 overflow-hidden rounded-xl border border-white/8">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.04]">
                    {a.table.cols.map((c) => (
                      <th key={c} className="px-4 py-2.5 text-[11px] tracking-[0.15em] text-white/50 font-medium">{c.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {a.table.rows.map((r, i) => (
                    <tr key={i} className="border-t border-white/6">
                      {r.map((cell, j) => (
                        <td key={j} className={`px-4 py-2.5 ${j === 0 ? 'text-foreground/90' : 'text-muted-foreground'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {a.list && (
            <ul className="mt-6 space-y-2.5">
              {a.list.map((l, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {l}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function GovernanceRoom() {
  const artifacts = content.governance.artifacts
  const [open, setOpen] = useState(null)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {artifacts.map((a, i) => {
          const Icon = ICONS[a.icon] || FileText
          return (
            <button
              key={a.title}
              onClick={() => setOpen(i)}
              style={{ animationDelay: `${(i % 4) * 0.5}s` }}
              className="card-domain animate-floaty group relative h-full rounded-2xl p-5 text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gold transition-colors group-hover:border-gold/40">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[10px] tracking-[0.25em] text-white/30">{a.tag}</span>
              </div>
              <h3 className="mt-5 font-display text-base font-semibold tracking-tight">{a.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{a.summary}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-white/40 group-hover:text-gold transition-colors">
                Open artifact <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {open !== null && <ArtifactModal a={artifacts[open]} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  )
}
