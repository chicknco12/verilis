'use client'

import { useState } from 'react'
import { Mail, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { content } from '@/lib/virellis/content'

const EMPTY_FORM = { name: '', email: '', organization: '', role: '', helpWith: '', message: '' }

export default function ContactSection() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [error, setError] = useState('')

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setError('')
    try {
      const formData = new FormData(e.currentTarget)
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      })
      if (!res.ok) {
        setError('Something went wrong. Please try again or email us directly.')
        setStatus('error')
        return
      }
      setForm(EMPTY_FORM)
      setStatus('success')
    } catch {
      setError('Connection issue. Please try again.')
      setStatus('error')
    }
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-gold/40 transition-colors'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <div className="lg:col-span-2 glass rounded-2xl p-7 flex flex-col">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gold">
          <Mail className="h-5 w-5" />
        </div>
        <div className="mt-6 text-sm font-medium">Prefer email?</div>
        <a href={`mailto:${content.contact.email}`} className="link-underline mt-2 text-lg font-display font-semibold text-gold-gradient break-all">
          {content.contact.email}
        </a>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {content.contact.subtitle}
        </p>
      </div>

      <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} className="lg:col-span-3 glass rounded-2xl p-7">
        <input type="hidden" name="form-name" value="contact" />
        <p className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [-webkit-clip-path:inset(50%)] [clip-path:inset(50%)]">
          <label>Do not fill this out if you are human: <input name="bot-field" /></label>
        </p>
        {status === 'success' ? (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-10 w-10 text-gold" />
            <div className="mt-4 font-display text-xl font-semibold">Message sent.</div>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Thank you for reaching out. A senior consultant will respond within one business day.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="btn-ghost mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-xs tracking-wide text-white/40">Name</span>
                <input required name="name" value={form.name} onChange={update('name')} placeholder="Your full name" className={inputClass} />
              </label>
              <label className="block">
                <span className="text-xs tracking-wide text-white/40">Email</span>
                <input required name="email" type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" className={inputClass} />
              </label>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs tracking-wide text-white/40">Organization (optional)</span>
              <input name="organization" value={form.organization} onChange={update('organization')} placeholder="Your organization" className={inputClass} />
            </label>
            <label className="block"><span className="text-xs tracking-wide text-white/40">Role</span><input name="role" value={form.role} onChange={update('role')} placeholder="Your role" className={inputClass} /></label>
            </div>
            <label className="mt-5 block"><span className="text-xs tracking-wide text-white/40">What can we help with?</span><select name="helpWith" value={form.helpWith} onChange={update('helpWith')} className={inputClass}><option value="">Select an option</option><option>Agile Consulting</option><option>Change Management</option><option>Organizational Transformation</option><option>Agile Coaching</option><option>Product Transformation</option><option>Leadership Enablement</option><option>Other</option></select></label>
            <label className="mt-5 block">
              <span className="text-xs tracking-wide text-white/40">Message</span>
              <textarea
                required
                name="message"
                rows={4}
                value={form.message}
                onChange={update('message')}
                placeholder="What are you trying to change?"
                className={`${inputClass} resize-none`}
              />
            </label>

            {status === 'error' && (
              <div className="mt-4 text-sm text-red-400">{error}</div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-gold mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {status === 'submitting' ? 'Sending…' : 'Start the conversation →'}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
