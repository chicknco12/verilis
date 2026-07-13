'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from 'recharts'
import { Activity } from 'lucide-react'

const GOLD = '#C8A96A'
const ELECTRIC = '#4D8DFF'

function Gauge({ label, value, hint, accent = GOLD }) {
  const r = 42
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value || 0))
  const off = c - (pct / 100) * c
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4">
      <div className="relative h-[92px] w-[92px] shrink-0">
        <svg viewBox="0 0 100 100" className="h-[92px] w-[92px] -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={r} fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={off}
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-semibold">
          {Math.round(value || 0)}%
        </div>
      </div>
      <div>
        <div className="text-sm text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
      </div>
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <div className="text-white/50 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

const STATUS = {
  'On Track': { c: '#4D8DFF', bg: 'rgba(77,141,255,0.12)' },
  'At Risk': { c: '#e0894f', bg: 'rgba(224,137,79,0.12)' },
  'Watch': { c: '#C8A96A', bg: 'rgba(200,169,106,0.12)' },
}

export default function PmoDashboard() {
  const [data, setData] = useState(null)
  const [pulse, setPulse] = useState(false)

  const load = async () => {
    try {
      const res = await fetch('/api/portfolio')
      const json = await res.json()
      setData(json)
      setPulse(true)
      setTimeout(() => setPulse(false), 700)
    } catch (e) { /* ignore */ }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 7000)
    return () => clearInterval(id)
  }, [])

  if (!data) {
    return <div className="glass rounded-2xl h-64 flex items-center justify-center text-muted-foreground">Initializing telemetry…</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`inline-flex h-2 w-2 rounded-full ${pulse ? 'bg-electric' : 'bg-electric/60'} transition-colors`} />
          LIVE · {data.activePrograms} active programmes · {data.dependencies} tracked dependencies
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/40"><Activity className="h-3.5 w-3.5" /> auto-refresh 7s</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Gauge label="Portfolio Health" value={data.kpis.portfolioHealth} hint="Green across delivery" accent={GOLD} />
        <Gauge label="Delivery Confidence" value={data.kpis.deliveryConfidence} hint="Forecast to plan" accent={ELECTRIC} />
        <Gauge label="Budget Health" value={data.kpis.budgetHealth} hint="Within tolerance" accent={GOLD} />
        <Gauge label="Risk Index" value={data.kpis.riskIndex} hint="Lower is better" accent={ELECTRIC} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="text-sm text-foreground mb-4">Delivery Velocity: planned vs actual</div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={data.velocity} margin={{ left: -18, right: 6, top: 4 }}>
              <defs>
                <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ELECTRIC} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={ELECTRIC} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="planned" name="Planned" stroke={GOLD} strokeWidth={2} fill="url(#gGold)" />
              <Area type="monotone" dataKey="actual" name="Actual" stroke={ELECTRIC} strokeWidth={2} fill="url(#gBlue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-foreground mb-4">Risk Exposure by Category</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data.risk} layout="vertical" margin={{ left: 12, right: 12 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" name="Exposure" fill={ELECTRIC} radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-foreground mb-4">Budget: allocated vs spent (£m)</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={data.budget} margin={{ left: -20, right: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="allocated" name="Allocated" fill={GOLD} radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="spent" name="Spent" fill={ELECTRIC} radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="text-sm text-foreground mb-4">Programme Portfolio</div>
          <div className="space-y-3">
            {data.programs.map((p) => {
              const s = STATUS[p.status] || STATUS['Watch']
              return (
                <div key={p.name} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground truncate">{p.name}</span>
                      <span className="text-xs text-white/40 ml-3 shrink-0">{p.phase}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.confidence}%`, background: `linear-gradient(90deg, ${GOLD}, ${ELECTRIC})`, transition: 'width 1s cubic-bezier(0.22,1,0.36,1)' }} />
                    </div>
                  </div>
                  <span className="text-xs font-medium shrink-0 w-10 text-right" style={{ color: s.c }}>{p.confidence}%</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full shrink-0" style={{ color: s.c, background: s.bg }}>{p.status}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
