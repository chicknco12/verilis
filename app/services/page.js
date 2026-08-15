'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { content } from '@/lib/virellis/content'
import { ICONS, Reveal, PageHeader } from '@/components/virellis/ui'
import DeliveryFramework from '@/components/virellis/DeliveryFramework'
import GovernanceRoom from '@/components/virellis/GovernanceRoom'
import DomainRoom from '@/components/virellis/DomainRoom'

const App = () => {
  const [openDomain, setOpenDomain] = useState(null)

  return (
    <main>
      <AnimatePresence>
        {openDomain !== null && (
          <DomainRoom domain={content.domains[openDomain]} onClose={() => setOpenDomain(null)} />
        )}
      </AnimatePresence>

      <PageHeader eyebrow={content.studio.eyebrow} title={content.studio.title} subtitle={content.studio.subtitle} />

      {/* DOMAINS */}
      <section className="relative py-16 md:py-20 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.domains.map((d, i) => {
              const Icon = ICONS[d.icon]
              return (
                <Reveal key={d.name} delay={(i % 4) * 0.08}>
                  <div onClick={() => setOpenDomain(i)} className="card-domain group relative h-full rounded-2xl p-6 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 text-gold transition-colors group-hover:border-gold/40">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-display text-xs tracking-[0.3em] text-muted-foreground/60">{d.n}</span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{d.name}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                    <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground group-hover:text-gold transition-colors">
                      Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* DELIVERY FRAMEWORK */}
      <section className="relative py-24 md:py-28 bg-[#F4F6F8]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.framework.eyebrow}</p>
            <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">{content.framework.title}</h2>
            <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{content.framework.subtitle}</p>
          </Reveal>
          <div className="mt-12"><DeliveryFramework /></div>
        </div>
      </section>

      {/* GOVERNANCE ROOM */}
      <section className="relative py-24 md:py-28 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.governance.eyebrow}</p>
            <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">{content.governance.title}</h2>
            <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{content.governance.subtitle}</p>
          </Reveal>
          <div className="mt-12"><GovernanceRoom /></div>
        </div>
      </section>
    </main>
  )
}

export default App
