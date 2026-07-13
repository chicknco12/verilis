'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Lenis from 'lenis'
import {
  Compass, ShieldCheck, Sparkles, Rocket, Database, Cloud,
  LayoutDashboard, Lightbulb, ArrowRight, ArrowUpRight, Plus, Command,
} from 'lucide-react'
import { content } from '@/lib/virellis/content'
import { scrollStore } from '@/lib/virellis/scrollStore'

const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })
import DeliveryFramework from './DeliveryFramework'
import DomainRoom from './DomainRoom'
const PmoDashboard = dynamic(() => import('./PmoDashboard'), { ssr: false })
const ConciergeBoardroom = dynamic(() => import('./ConciergeBoardroom'), { ssr: false })

const ICONS = { Compass, ShieldCheck, Sparkles, Rocket, Database, Cloud, LayoutDashboard, Lightbulb }

/* ---------------- Preloader (arrival experience) ---------------- */
function Preloader() {
  const letters = content.brand.name.split('')
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-graphite-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="flex overflow-hidden">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            className="font-display text-4xl md:text-6xl font-semibold tracking-[0.25em] text-foreground"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: 0.25 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="mt-6 text-[10px] md:text-xs tracking-[0.45em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        ENTERPRISE TRANSFORMATION HEADQUARTERS
      </motion.div>
      <motion.div
        className="mt-8 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 220, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  )
}

/* ---------------- Animated counter ---------------- */
function Counter({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const dur = 1700
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setN(value * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])
  const disp = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString()
  return <span ref={ref}>{prefix}{disp}{suffix}</span>
}

/* ---------------- Section reveal helper ---------------- */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Experience() {
  const [loading, setLoading] = useState(true)
  const [openDomain, setOpenDomain] = useState(null)
  const lenisRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2600)

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onScroll = () => {
      scrollStore.target = Math.min(1, window.scrollY / (window.innerHeight * 1.5))
    }
    const onMove = (e) => {
      scrollStore.mouseX = (e.clientX / window.innerWidth) * 2 - 1
      scrollStore.mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    onScroll()

    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const scrollTo = (href) => {
    if (lenisRef.current) lenisRef.current.scrollTo(href, { offset: -20 })
  }

  const HERO_DELAY = 2.75

  return (
    <main className="relative min-h-screen bg-graphite-950 text-foreground overflow-x-hidden">
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>
      <AnimatePresence>
        {openDomain !== null && (
          <DomainRoom domain={content.domains[openDomain]} onClose={() => setOpenDomain(null)} />
        )}
      </AnimatePresence>

      {/* Fixed 3D background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-space" />
        <div className="absolute inset-0">
          <Scene3D />
        </div>
        <div className="absolute inset-0 bg-vignette" />
        <div className="absolute inset-0 grain opacity-[0.25]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mt-4 flex items-center justify-between rounded-full glass px-5 py-3">
            <button onClick={() => scrollTo('#top')} className="flex items-center gap-2.5 group">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-gold animate-ping-slow opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
              </span>
              <span className="font-display text-sm font-semibold tracking-[0.32em] text-foreground">
                {content.brand.name}
              </span>
            </button>
            <div className="hidden md:flex items-center gap-8">
              {content.nav.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="link-underline text-[13px] tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollTo('#command')}
              className="btn-gold hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium"
            >
              Strategy Session <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10">
        {/* HERO */}
        <section id="top" className="relative flex min-h-screen items-center">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(ellipse at center, rgba(6,7,10,0.86) 0%, rgba(6,7,10,0.58) 42%, rgba(6,7,10,0) 72%)' }}
          />
          <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10 text-center">
            <motion.p
              className="mb-7 text-[11px] md:text-xs tracking-[0.5em] text-gold/80"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: HERO_DELAY, duration: 1 }}
            >
              {content.hero.eyebrow}
            </motion.p>
            <motion.h1
              className="font-display mx-auto max-w-4xl text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: HERO_DELAY + 0.15, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              The operating system for{' '}
              <span className="text-gold-gradient">enterprise transformation.</span>
            </motion.h1>
            <motion.p
              className="mx-auto mt-7 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: HERO_DELAY + 0.35, duration: 1 }}
            >
              {content.hero.subtitle}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: HERO_DELAY + 0.5, duration: 1 }}
            >
              <button onClick={() => scrollTo('#studio')} className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium">
                {content.hero.cta} <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => scrollTo('#command')} className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium">
                {content.hero.cta2}
              </button>
            </motion.div>
          </div>

          <motion.button
            onClick={() => scrollTo('#studio')}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] tracking-[0.35em] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: HERO_DELAY + 0.9, duration: 1 }}
          >
            {content.hero.scrollHint.toUpperCase()}
            <span className="h-10 w-px bg-gradient-to-b from-gold/70 to-transparent animate-scroll-line" />
          </motion.button>
        </section>

        {/* STUDIO / DOMAINS */}
        <section id="studio" className="relative py-32 md:py-40">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <Reveal className="max-w-3xl">
              <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.studio.eyebrow}</p>
              <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
                {content.studio.title}
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{content.studio.subtitle}</p>
            </Reveal>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.domains.map((d, i) => {
                const Icon = ICONS[d.icon] || Sparkles
                return (
                  <Reveal key={d.name} delay={(i % 4) * 0.08}>
                    <div onClick={() => setOpenDomain(i)} className="card-domain group relative h-full rounded-2xl p-6 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gold transition-colors group-hover:border-gold/40">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-display text-xs tracking-[0.3em] text-white/25">{d.n}</span>
                      </div>
                      <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{d.name}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                      <div className="mt-6 flex items-center gap-2 text-xs text-white/40 group-hover:text-gold transition-colors">
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
        <section id="framework" className="relative py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <Reveal className="max-w-3xl">
              <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.framework.eyebrow}</p>
              <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
                {content.framework.title}
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{content.framework.subtitle}</p>
            </Reveal>
            <div className="mt-12">
              <DeliveryFramework />
            </div>
          </div>
        </section>

        {/* PMO DASHBOARD */}
        <section id="dashboard" className="relative py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <Reveal className="max-w-3xl">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.45em] text-gold/80">
                <Command className="h-4 w-4" /> THE COMMAND CENTER
              </div>
              <h2 className="font-display mt-5 text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
                Live executive telemetry for enterprise delivery.
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                A real-time PMO operating picture: portfolio health, delivery confidence, risk exposure, budget and programme velocity, the way a transformation leader reads the enterprise.
              </p>
            </Reveal>
            <div className="mt-12">
              <PmoDashboard />
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section id="capabilities" className="relative py-28">
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

        {/* INDUSTRIES */}
        <section className="relative py-6">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <Reveal>
              <div className="glass rounded-2xl px-6 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <span className="text-[11px] tracking-[0.35em] text-white/40">INDUSTRIES SERVED</span>
                {content.industries.map((i) => (
                  <span key={i} className="text-sm text-muted-foreground">{i}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOUNDER */}
        <section id="founder" className="relative py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <Reveal>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gold/10 blur-2xl" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/10">
                    <img
                      src={content.founder.image}
                      alt={content.founder.name}
                      className="h-[520px] w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <div className="font-display text-xl font-semibold">{content.founder.name}</div>
                      <div className="text-sm text-gold">{content.founder.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-[11px] tracking-[0.45em] text-gold/80">{content.founder.eyebrow}</p>
                <h2 className="font-display mt-5 text-lg md:text-xl font-medium leading-relaxed tracking-tight text-foreground/90">
                  {content.founder.bio.map((p, i) => (
                    <span key={i} className={i > 0 ? 'block mt-4' : 'block'}>{p}</span>
                  ))}
                </h2>
                <blockquote className="mt-8 border-l-2 border-gold/50 pl-5 text-lg text-muted-foreground italic">
                  {'\u201C'}{content.founder.quote}{'\u201D'}
                </blockquote>
                <div className="mt-10 grid grid-cols-3 gap-4">
                  {content.founder.stats.map((s) => (
                    <div key={s.k} className="glass rounded-xl p-4">
                      <div className="font-display text-xl font-semibold text-foreground">{s.k}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* AI CONCIERGE BOARDROOM */}
        <section id="concierge" className="relative py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] glass p-6 md:p-12">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-electric/20 blur-[90px]" />
                <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gold/20 blur-[90px]" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.45em] text-gold/80">
                    <Command className="h-4 w-4" /> THE BOARDROOM
                  </div>
                  <h2 className="font-display mt-5 max-w-3xl text-3xl md:text-5xl font-semibold leading-[1.08] tracking-tight">
                    Start with a conversation. Leave with a brief.
                  </h2>
                  <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                    Describe the transformation you are navigating, the pressure, the timeline, the stakeholders. The Virellis concierge qualifies the engagement in real time, then generates a board-ready brief: scope, workstreams, recommended approach, and a follow-up you can share internally within minutes.
                  </p>
                  <div className="mt-9">
                    <ConciergeBoardroom />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative border-t border-white/5 py-16">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div>
                <div className="font-display text-lg font-semibold tracking-[0.28em]">{content.brand.name}</div>
                <p className="mt-4 max-w-xs text-sm text-muted-foreground">{content.footer.tagline}</p>
              </div>
              {content.footer.columns.map((c) => (
                <div key={c.title}>
                  <div className="text-xs tracking-[0.3em] text-white/40">{c.title.toUpperCase()}</div>
                  <ul className="mt-4 space-y-2.5">
                    {c.links.map((l) => (
                      <li key={l}>
                        <span className="link-underline text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/35">
              <span>{'\u00A9'} {new Date().getFullYear()} Virellis. {content.brand.tagline}</span>
              <span className="tracking-[0.3em]">ENTERPRISE TRANSFORMATION HEADQUARTERS</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
