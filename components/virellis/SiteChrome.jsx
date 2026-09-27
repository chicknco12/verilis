'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { content } from '@/lib/virellis/content'
import { scrollStore } from '@/lib/virellis/scrollStore'
import LogoMark from './Logo'
import TransformationMode from './TransformationMode'

const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false })

function Preloader() {
  const letters = content.brand.name.split('')
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <LogoMark className="h-9 w-9" />
        <div className="flex overflow-hidden">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              className="font-display text-4xl md:text-5xl font-semibold tracking-[0.22em] text-ink"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>
      <motion.div
        className="mt-6 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 220, opacity: 1 }}
        transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  )
}

export default function SiteChrome({ children }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [transformMode, setTransformMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lenisRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis
    let raf
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
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

  // Scroll to top + close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const seq = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
    let idx = 0
    const onKey = (e) => {
      const k = (e.key || '').toLowerCase()
      if (k === seq[idx]) {
        idx += 1
        if (idx === seq.length) { setTransformMode(true); idx = 0 }
      } else {
        idx = k === seq[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>
      <AnimatePresence>
        {transformMode && <TransformationMode onClose={() => setTransformMode(false)} />}
      </AnimatePresence>

      {/* Fixed 3D background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-space" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0"><Scene3D /></div>
        <div className="absolute inset-0 bg-vignette" />
        <div className="absolute inset-0 grain opacity-[0.04]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mt-4 flex items-center justify-between rounded-full glass px-5 py-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <LogoMark className="h-7 w-7" />
              <span className="font-display text-sm font-semibold tracking-[0.28em] text-ink">{content.brand.name}</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {content.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`link-underline text-[13px] tracking-wide transition-colors ${isActive(item.href) ? 'text-gold' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Link href="/contact" className="btn-gold hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium">
                Strategy Session <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground" aria-label="Menu">
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="md:hidden mt-2 rounded-2xl glass p-3"
              >
                {content.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-4 py-2.5 text-sm ${isActive(item.href) ? 'text-gold bg-gold/10' : 'text-muted-foreground'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Page content */}
      <div className="relative z-10">
        {children}

        {/* Footer */}
        <footer className="relative border-t border-border bg-paper py-16">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-2.5">
                  <LogoMark className="h-7 w-7" />
                  <span className="font-display text-lg font-semibold tracking-[0.24em]">{content.brand.name}</span>
                </div>
                <p className="mt-4 max-w-xs text-sm text-muted-foreground">{content.footer.tagline}</p>
              </div>
              {content.footer.columns.map((c) => (
                <div key={c.title}>
                  <div className="text-xs tracking-[0.3em] text-muted-foreground">{c.title.toUpperCase()}</div>
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
            <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground">
              <span>{'\u00A9'} {new Date().getFullYear()} Virellis. {content.brand.tagline}</span>
              <span className="tracking-[0.3em]">ENTERPRISE TRANSFORMATION HEADQUARTERS</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
