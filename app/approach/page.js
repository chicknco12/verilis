import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const stages = [
  ['01', 'Discover', 'Leadership interviews, team assessments, delivery data and change readiness reveal the real system before solutions are proposed.'],
  ['02', 'Align', 'We create shared clarity around outcomes, priorities, leadership expectations and the measures that will show progress.'],
  ['03', 'Design', 'Together we shape target ways of working, operating models, team structures, governance and a practical roadmap.'],
  ['04', 'Activate', 'Coaching, workshops, leader enablement and change interventions move the work from intent into everyday practice.'],
  ['05', 'Measure & Adapt', 'We track flow, adoption, engagement and outcomes so the transformation can learn and adjust as it progresses.'],
]

export default function ApproachPage() {
  return <main>
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-40 md:px-10 md:pb-32">
      <p className="text-xs tracking-[0.32em] text-gold">OUR APPROACH</p>
      <h1 className="font-display mt-7 max-w-5xl text-5xl font-semibold leading-[1.03] tracking-tight md:text-7xl">Transformation built around your organization, not a template.</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">We begin with the context: your constraints, leadership environment, customers, teams and ambitions. Frameworks are tools, never the starting point.</p>
    </section>
    <section className="border-y border-border bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">
        {stages.map(([number, title, text]) => <div key={number} className="grid gap-5 border-b border-border py-8 last:border-0 md:grid-cols-[120px_1fr_1.5fr] md:items-start">
          <div className="text-sm tracking-[0.2em] text-gold">{number}</div><h2 className="font-display text-3xl font-semibold">{title}</h2><p className="leading-relaxed text-muted-foreground">{text}</p>
        </div>)}
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-24 text-center md:px-10"><h2 className="font-display mx-auto max-w-4xl text-3xl font-semibold md:text-5xl">Transformation is not a rollout. It is a capability the organization learns to sustain.</h2><Link href="/contact" className="btn-gold mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5">Start your transformation <ArrowRight className="h-4 w-4" /></Link></section>
  </main>
}
