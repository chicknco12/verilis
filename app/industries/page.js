'use client'

import { content } from '@/lib/virellis/content'
import { Reveal, Counter, PageHeader } from '@/components/virellis/ui'

const App = () => {
  return (
    <main>
      <PageHeader
        eyebrow="INDUSTRIES"
        title="Trusted where the stakes are highest."
        subtitle="Virellis delivers into regulated, complex, high-accountability environments where transformation cannot afford to fail."
      />

      {/* INDUSTRY GRID */}
      <section className="relative py-16 md:py-20 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.industries.map((ind, i) => (
              <Reveal key={ind} delay={(i % 3) * 0.08}>
                <div className="card-domain rounded-2xl p-7 h-full">
                  <div className="font-display text-xs tracking-[0.3em] text-gold/80">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{ind}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    Senior delivery leadership, governance and applied intelligence tailored to the regulatory and operating reality of {ind.toLowerCase()}.
                  </p>
                </div>
              </Reveal>
            ))}
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
    </main>
  )
}

export default App
