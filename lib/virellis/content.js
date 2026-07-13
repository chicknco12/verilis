// All copy + data lives here so real content can be swapped later
// WITHOUT touching layouts or interactions.

export const content = {
  brand: {
    name: 'VIRELLIS',
    tagline: 'Transforming Strategy into Delivery.',
    altTagline: 'Where Enterprise Transformation Meets Intelligent Delivery.',
  },
  nav: [
    { label: 'The Studio', href: '#studio' },
    { label: 'Command Center', href: '#dashboard' },
    { label: 'Founder', href: '#founder' },
    { label: 'Concierge', href: '#concierge' },
  ],
  hero: {
    eyebrow: 'ENTERPRISE TRANSFORMATION HEADQUARTERS',
    title: 'The operating system for enterprise transformation.',
    subtitle:
      'Virellis partners with government, healthcare, financial services, and technology enterprises to turn strategic ambition into governed, measurable delivery.',
    cta: 'Explore the Studio',
    cta2: 'Enter the Command Center',
    scrollHint: 'Scroll to disassemble the system',
  },
  studio: {
    eyebrow: 'THE TRANSFORMATION STUDIO',
    title: 'Eight domains. One delivery philosophy.',
    subtitle:
      'Virellis is structured as a single operating model — eight integrated disciplines, one delivery philosophy, one senior consultant who knows the whole picture. Not a firm that scales headcount. A headquarters that scales thinking.',
  },
  domains: [
    { n: '01', name: 'Strategy', desc: 'Executive vision translated into fundable, deliverable roadmaps.', icon: 'Compass' },
    { n: '02', name: 'Governance', desc: 'Assurance, controls and decision rights that de-risk delivery.', icon: 'ShieldCheck' },
    { n: '03', name: 'AI', desc: 'Applied intelligence embedded across the delivery lifecycle.', icon: 'Sparkles' },
    { n: '04', name: 'Delivery', desc: 'Predictable execution of complex, multi-year programmes.', icon: 'Rocket' },
    { n: '05', name: 'Data', desc: 'Trusted data foundations that power confident decisions.', icon: 'Database' },
    { n: '06', name: 'Cloud', desc: 'Modern platforms engineered for scale and resilience.', icon: 'Cloud' },
    { n: '07', name: 'PMO', desc: 'Next-generation portfolio and programme operating models.', icon: 'LayoutDashboard' },
    { n: '08', name: 'Innovation', desc: 'New operating models that compound enterprise value.', icon: 'Lightbulb' },
  ],
  metrics: {
    eyebrow: 'WHAT WE BRING TO THE TABLE',
    title: 'Outcomes leadership teams can put in front of the board.',
    items: [
      { value: 8, suffix: '+', decimals: 0, label: 'Years in senior delivery' },
      { value: 6, suffix: '', decimals: 0, label: 'Regulated industries served' },
      { display: 'C-suite', label: 'Stakeholder advisory' },
      { display: 'Global', label: 'Multi-region programmes' },
    ],
  },
  founder: {
    eyebrow: 'THE PRINCIPAL',
    role: 'Founder & Principal Consultant',
    name: 'Fidelis Chick',
    bio: [
      'Fidelis Chick has spent eight years in the room where transformation decisions get made — and where they fall apart. Working across government, financial services, and enterprise technology, she has led programmes where failure was not an option and built the governance frameworks to prove it.',
      'Virellis exists because most enterprises have the strategy. What they lack is the operating model to deliver it. That gap is where she works.',
    ],
    quote: 'Complexity is not the enemy. Unmanaged complexity is what derails programmes. My work is turning ambiguity into a delivery model the board can trust.',
    image: '/founder.jpg',
    stats: [
      { k: '8+', v: 'Years leading delivery' },
      { k: 'C-suite', v: 'Advisory & assurance' },
      { k: 'Global', v: 'Multi-region programmes' },
    ],
  },
  command: {
    eyebrow: 'THE COMMAND CENTER',
    title: 'Step inside the enterprise transformation command center.',
    subtitle:
      'A conversational AI concierge, live portfolio telemetry and a governance operating model.',
    cta: 'Book a Strategy Session',
    modules: ['AI Concierge', 'Live PMO Dashboard', 'Governance Room', 'Delivery Framework'],
  },
  industries: ['Government', 'Healthcare', 'Financial Services', 'Technology', 'Retail', 'Telecommunications', 'Consulting'],
  footer: {
    tagline: 'Strategy is easy. Delivery is the work. Virellis does the work.',
    columns: [
      { title: 'Studio', links: ['Strategy', 'Governance', 'Delivery', 'AI Adoption'] },
      { title: 'Firm', links: ['Founder', 'Approach', 'Insights', 'Contact'] },
      { title: 'Command Center', links: ['AI Concierge', 'PMO Dashboard', 'Frameworks', 'Playbooks'] },
    ],
  },
}
