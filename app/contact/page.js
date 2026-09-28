import { ArrowUpRight } from 'lucide-react'

const emailHref = 'mailto:hello@vrls.ca?subject=Let%27s%20Talk%20About%20Transformation'

export default function ContactPage() {
  return <main className="mx-auto flex min-h-[75vh] max-w-7xl items-center px-6 py-32 md:px-10">
    <section className="max-w-4xl">
      <p className="text-xs tracking-[0.3em] text-electric">CONTACT</p>
      <h1 className="font-display mt-7 text-5xl font-semibold leading-[1.03] tracking-tight md:text-7xl">Let&apos;s talk about what&apos;s changing.</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">Whether you&apos;re beginning a transformation, strengthening Agile delivery, redesigning how teams work or navigating organizational change, we&apos;d like to hear about the challenge.</p>
      <a href={emailHref} className="link-underline mt-12 inline-flex items-center gap-2 text-lg font-medium text-electric">Contact us <ArrowUpRight className="h-5 w-5" /></a>
      <a href={emailHref} className="mt-8 block text-xl text-foreground underline decoration-border underline-offset-8 hover:decoration-electric">hello@vrls.ca</a>
    </section>
  </main>
}
