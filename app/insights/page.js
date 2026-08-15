'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { content } from '@/lib/virellis/content'
import { Reveal, PageHeader } from '@/components/virellis/ui'

const App = () => {
  const ins = content.insights
  return (
    <main>
      <PageHeader eyebrow={ins.eyebrow} title={ins.title} subtitle={ins.subtitle} />

      <section className="relative py-16 md:py-24 bg-paper">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ins.articles.map((art, i) => (
              <Reveal key={art.title} delay={(i % 3) * 0.08}>
                <div className="card-domain group flex h-full flex-col rounded-2xl p-6 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-wide text-gold">{art.category}</span>
                    <span className="text-[11px] text-muted-foreground">{art.read}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold leading-snug tracking-tight">{art.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{art.excerpt}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground group-hover:text-gold transition-colors">
                    Read perspective <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 rounded-[1.75rem] p-10 text-center" style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #E7EEFF 100%)' }}>
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Want these perspectives applied to your programme?</h2>
              <Link href="/contact" className="btn-gold mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
                Start a conversation <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default App
