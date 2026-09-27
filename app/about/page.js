'use client'

import { content } from '@/lib/virellis/content'
import { Reveal, PageHeader } from '@/components/virellis/ui'
import LeadershipConstellation from '@/components/virellis/LeadershipConstellation'
import TestimonialsOrbit from '@/components/virellis/TestimonialsOrbit'

const App = () => {
  const a = content.about
  return (
    <main>
      <PageHeader eyebrow={a.eyebrow} title={a.title} subtitle={a.intro} />

      {/* FIRM NARRATIVE + VALUES */}
      <section className="relative py-16 md:py-24 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <Reveal>
              <div className="space-y-5">
                {a.paras.map((p, i) => (
                  <p key={i} className="text-base md:text-lg leading-relaxed text-foreground/85">{p}</p>
                ))}
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4">
                {a.stats.map((s) => (
                  <div key={s.k} className="glass rounded-xl p-4">
                    <div className="font-display text-xl font-semibold text-gold-gradient">{s.k}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="space-y-4">
                {a.values.map((v) => (
                  <div key={v.k} className="card-domain rounded-2xl p-6">
                    <h3 className="font-display text-lg font-semibold tracking-tight">{v.k}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* LEADERSHIP PHILOSOPHY */}
      <section className="relative py-24 md:py-28 bg-[#F4F6F8]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.leadership.eyebrow}</p>
            <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">{content.leadership.title}</h2>
            <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{content.leadership.subtitle}</p>
          </Reveal>
          <div className="mt-12"><LeadershipConstellation /></div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-24 md:py-28 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.testimonials.eyebrow}</p>
            <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">{content.testimonials.title}</h2>
            <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{content.testimonials.subtitle}</p>
          </Reveal>
        </div>
        <div className="mt-12"><TestimonialsOrbit /></div>
      </section>
    </main>
  )
}

export default App
