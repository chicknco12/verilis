'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { content } from '@/lib/virellis/content'
import { Reveal, Counter } from '@/components/virellis/ui'

const App = () => {
  return (
    <main>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.62) 45%, rgba(255,255,255,0) 72%)' }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10 text-center">
          <motion.p className="mb-7 text-[11px] md:text-xs tracking-[0.5em] text-gold/80"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>
            {content.hero.eyebrow}
          </motion.p>
          <motion.h1 className="font-display mx-auto max-w-4xl text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
            Make change <span className="text-gold-gradient">work in the real world.</span>
          </motion.h1>
          <motion.p className="mx-auto mt-7 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}>
            {content.hero.subtitle}
          </motion.p>
          <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 1 }}>
            <Link href="/agile-consulting" className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium">
              Explore Agile Consulting <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/change-management" className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium">
              Explore Change Management
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CAPABILITIES PREVIEW */}
      <section className="relative py-28 md:py-32 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.studio.eyebrow}</p>
            <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">{content.studio.title}</h2>
            <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{content.studio.subtitle}</p>
          </Reveal>
          <div className="mt-16 divide-y divide-border border-y border-border">
            {content.domains.slice(0, 4).map((d, i) => {
              return (
                <Reveal key={d.name} delay={i * 0.06}>
                  <Link href={i === 0 ? '/expertise/agile-consulting' : i === 1 ? '/expertise/change-management' : '/services'} className="group grid gap-4 py-8 md:grid-cols-[100px_1fr_1.2fr_auto] md:items-center">
                    <span className="text-xs tracking-[0.25em] text-electric">{d.n}</span>
                    <h3 className="font-display text-2xl font-medium tracking-tight">{d.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-electric" />
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="relative py-24 bg-[#F4F6F8]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.metrics.eyebrow}</p>
            <h2 className="font-display mt-5 text-3xl md:text-4xl font-semibold tracking-tight">{content.metrics.title}</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {content.metrics.items.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="glass rounded-2xl p-7">
                  <div className="font-display text-3xl md:text-4xl font-semibold text-gold-gradient">
                    {m.display ? m.display : <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />}
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #E7EEFF 100%)' }}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-[80px]" />
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">Ready to make change stick?</h2>
              <p className="mx-auto mt-5 max-w-xl text-muted-foreground">Start with the work, the people and the decisions that will make the difference.</p>
              <Link href="/contact" className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium">
                Book a Discovery Call <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default App
