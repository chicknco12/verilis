'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageHeader, Reveal } from '@/components/virellis/ui'

export default function PracticePage({ practice }) {
  return (
    <main>
      <PageHeader eyebrow={practice.eyebrow} title={practice.title} subtitle={practice.subtitle} />

      <section className="relative py-16 md:py-24 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] tracking-[0.45em] text-gold/80">WHAT CHANGES</p>
            <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">Progress people can feel in the work.</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {practice.outcomes.map((outcome, index) => (
              <Reveal key={outcome.title} delay={index * 0.08}>
                <div className="card-domain h-full rounded-2xl p-7">
                  <div className="font-display text-xs tracking-[0.3em] text-gold/80">{String(index + 1).padStart(2, '0')}</div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{outcome.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{outcome.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 bg-[#F4F6F8]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
            <Reveal>
              <p className="text-[11px] tracking-[0.45em] text-gold/80">HOW WE WORK</p>
              <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">Practical, embedded and built around your context.</h2>
            </Reveal>
            <div className="space-y-5">
              {practice.approach.map((step, index) => (
                <Reveal key={step} delay={index * 0.08}>
                  <div className="flex gap-4 rounded-2xl border border-border bg-white/60 p-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <p className="text-sm md:text-base leading-relaxed text-foreground/85">{step}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-24 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <div className="rounded-[2rem] p-10 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #E7EEFF 100%)' }}>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">Start with a focused conversation.</h2>
              <p className="mx-auto mt-5 max-w-xl text-muted-foreground leading-relaxed">We will help you clarify the opportunity, the constraints and the first useful step.</p>
              <Link href="/contact" className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium">
                {practice.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
