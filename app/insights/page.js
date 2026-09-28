'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { content } from '@/lib/virellis/content'
import { Reveal, PageHeader } from '@/components/virellis/ui'

const App = () => {
  const ins = content.insights
  const [selected, setSelected] = useState(null)
  useEffect(() => { const close = (event) => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [])
  return (
    <main>
      <PageHeader eyebrow={ins.eyebrow} title={ins.title} subtitle={ins.subtitle} />

      <section className="relative py-16 md:py-24 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ins.articles.map((art, i) => (
              <Reveal key={art.title} delay={(i % 3) * 0.08}>
                <button onClick={() => setSelected(art)} className="card-domain group flex h-full w-full flex-col rounded-2xl p-6 text-left cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-wide text-gold">{art.category}</span>
                    <span className="text-[11px] text-muted-foreground">{art.read}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold leading-snug tracking-tight">{art.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{art.excerpt}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground group-hover:text-gold transition-colors">
                    Read insight <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 rounded-[1.75rem] p-10 text-center" style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #E7EEFF 100%)' }}>
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Want these ideas applied to your change?</h2>
              <Link href="/contact" className="btn-gold mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
                Start a conversation <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <AnimatePresence>{selected && <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" /><motion.article role="dialog" aria-modal="true" aria-label={selected.title} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} onClick={e => e.stopPropagation()} className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-border bg-graphite-800 p-7 md:p-10"><button onClick={() => setSelected(null)} className="absolute right-5 top-5 p-2 text-muted-foreground hover:text-foreground" aria-label="Close insight"><X className="h-5 w-5" /></button><p className="text-xs tracking-[0.25em] text-gold">{selected.category} · {selected.read}</p><h2 className="font-display mt-6 max-w-xl text-3xl font-semibold leading-tight md:text-5xl">{selected.title}</h2><p className="mt-6 text-lg leading-relaxed text-muted-foreground">{selected.excerpt}</p><div className="mt-10 border-t border-border pt-6"><p className="text-xs tracking-[0.25em] text-gold">KEY TAKEAWAY</p><p className="mt-3 leading-relaxed text-foreground/85">Lasting change comes from redesigning the conditions around the work, not asking people to perform a new process in the same old system.</p></div><Link href="/contact" className="btn-gold mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">Facing a similar challenge? Let&apos;s talk. <ArrowUpRight className="h-4 w-4" /></Link></motion.article></motion.div>}</AnimatePresence>
    </main>
  )
}

export default App
