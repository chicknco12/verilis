'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, FileText, Mail, ClipboardList, Loader2, ArrowRight } from 'lucide-react'

const GREETING = 'Welcome to the Virellis boardroom. I’m the Virellis concierge. What transformation are you trying to achieve?'

export default function ConciergeBoardroom() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userTurns, setUserTurns] = useState(0)
  const [brief, setBrief] = useState(null)
  const [briefLoading, setBriefLoading] = useState(false)
  const sessionId = useRef(null)
  const scroller = useRef(null)

  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now())
    }
  }, [])

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight
  }, [messages, loading, brief])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.current, message: text }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || 'Apologies — I had trouble responding. Please try again.' }])
      if (typeof data.userTurns === 'number') setUserTurns(data.userTurns)
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Connection issue. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const generateBrief = async () => {
    if (briefLoading) return
    setBriefLoading(true)
    try {
      const res = await fetch('/api/concierge/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.current }),
      })
      const data = await res.json()
      setBrief(data.brief || null)
    } catch (e) { /* ignore */ } finally {
      setBriefLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const suggestions = ['AI adoption across delivery', 'Modernize our PMO', 'Rescue an at-risk programme', 'Governance & assurance uplift']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3 glass rounded-2xl flex flex-col overflow-hidden" style={{ minHeight: 460 }}>
        <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-electric animate-ping-slow opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric" />
          </span>
          <span className="text-sm font-medium">Virellis Concierge</span>
          <span className="ml-auto text-[11px] text-white/35">Enterprise Boardroom</span>
        </div>

        <div ref={scroller} className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ maxHeight: 360 }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-gold text-graphite-950 rounded-br-sm' : 'bg-white/[0.05] text-foreground rounded-bl-sm border border-white/8'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm bg-white/[0.05] border border-white/8 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-gold" />
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="px-5 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setInput(s)} className="text-[11px] rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/60 hover:text-gold hover:border-gold/40 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-white/8 p-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Describe the transformation you’re driving…"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-white/30"
          />
          <button onClick={send} disabled={loading || !input.trim()} className="btn-gold inline-flex items-center justify-center rounded-xl h-10 w-10 disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4 text-gold" /> Engagement Brief</div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Once the concierge understands your goal, generate a board-ready brief — agenda, proposed workstreams, a follow-up email and a CRM entry — automatically.
          </p>
          <button
            onClick={generateBrief}
            disabled={userTurns < 2 || briefLoading}
            className="btn-gold mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {briefLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {briefLoading ? 'Composing…' : 'Generate Engagement Brief'}
          </button>
          {userTurns < 2 && <div className="mt-2 text-[11px] text-white/35">Share a little more so I can tailor it.</div>}
        </div>

        <AnimatePresence>
          {brief && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl p-5 space-y-5"
            >
              {brief.summary && (
                <div>
                  <div className="text-[11px] tracking-[0.3em] text-gold/80">EXECUTIVE SUMMARY</div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{brief.summary}</p>
                </div>
              )}
              {Array.isArray(brief.agenda) && brief.agenda.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] tracking-[0.3em] text-gold/80"><ClipboardList className="h-3.5 w-3.5" /> STRATEGY SESSION AGENDA</div>
                  <ul className="mt-2 space-y-1.5">
                    {brief.agenda.map((a, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="text-gold">{String(i + 1).padStart(2, '0')}</span> {a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(brief.proposalOutline) && brief.proposalOutline.length > 0 && (
                <div>
                  <div className="text-[11px] tracking-[0.3em] text-gold/80">PROPOSED WORKSTREAMS</div>
                  <div className="mt-2 space-y-2">
                    {brief.proposalOutline.map((p, i) => (
                      <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                        <div className="text-sm text-foreground">{p.title}</div>
                        {p.detail && <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{p.detail}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {brief.followUpEmail && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] tracking-[0.3em] text-gold/80"><Mail className="h-3.5 w-3.5" /> FOLLOW-UP EMAIL</div>
                  <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-white/8 bg-graphite-900/60 p-3 text-xs leading-relaxed text-foreground/80 font-sans">{brief.followUpEmail}</pre>
                </div>
              )}
              {brief.crm && (brief.crm.organization || brief.crm.leadName) && (
                <div>
                  <div className="text-[11px] tracking-[0.3em] text-gold/80">CRM ENTRY</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {brief.crm.leadName && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">{brief.crm.leadName}</span>}
                    {brief.crm.organization && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">{brief.crm.organization}</span>}
                    {brief.crm.industry && <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">{brief.crm.industry}</span>}
                    {brief.crm.priority && <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-gold">Priority: {brief.crm.priority}</span>}
                  </div>
                  {brief.crm.nextStep && <div className="mt-2 flex items-center gap-1.5 text-xs text-electric"><ArrowRight className="h-3.5 w-3.5" /> {brief.crm.nextStep}</div>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
