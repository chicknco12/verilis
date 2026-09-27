'use client'

import dynamic from 'next/dynamic'
import { content } from '@/lib/virellis/content'
import { Reveal, PageHeader } from '@/components/virellis/ui'

const ConciergeBoardroom = dynamic(() => import('@/components/virellis/ConciergeBoardroom'), { ssr: false })

const App = () => {
  const c = content.contact
  return (
    <main>
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

      <section className="relative py-12 md:py-16 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {c.channels.map((ch) => (
              <Reveal key={ch.k}>
                <div className="glass rounded-2xl p-6">
                  <div className="text-[11px] tracking-[0.3em] text-gold/80">{ch.k.toUpperCase()}</div>
                  <div className="mt-2 font-display text-lg font-semibold tracking-tight">{ch.v}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-20" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EFF4FF 40%, #E7EEFF 100%)' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] glass p-6 md:p-12">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-electric/15 blur-[90px]" />
              <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gold/15 blur-[90px]" />
              <div className="relative">
                <h2 className="font-display max-w-3xl text-2xl md:text-4xl font-semibold leading-[1.1] tracking-tight">The Virellis Concierge</h2>
                <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">Describe your transformation and generate a board-ready brief in minutes.</p>
                <div className="mt-9"><ConciergeBoardroom /></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default App
