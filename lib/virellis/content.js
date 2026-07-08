// All copy + data lives here so real content can be swapped later
// WITHOUT touching layouts or interactions. (Placeholder content for now.)

export const content = {
  brand: {
    name: 'VIRELLIS',
    tagline: 'Transforming Strategy into Delivery.',
    altTagline: 'Where Enterprise Transformation Meets Intelligent Delivery.',
  },
  nav: [
    { label: 'The Studio', href: '#studio' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Founder', href: '#founder' },
    { label: 'Command Center', href: '#command' },
  ],
  hero: {
    eyebrow: 'ENTERPRISE TRANSFORMATION HEADQUARTERS',
    title: 'Transforming Enterprise Complexity into Intelligent Delivery',
    subtitle:
      'Helping governments, healthcare organizations, financial institutions and enterprise technology companies deliver transformation with confidence.',
    cta: 'Explore the Transformation Studio',
    cta2: 'Enter the Command Center',
    scrollHint: 'Scroll to disassemble the system',
  },
  studio: {
    eyebrow: 'THE TRANSFORMATION STUDIO',
    title: 'Eight domains. One operating system for enterprise change.',
    subtitle:
      'The complexity sphere resolves into the disciplines Virellis orchestrates end to end \u2014 each a room inside the transformation headquarters.',
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
    eyebrow: 'PROVEN AT ENTERPRISE SCALE',
    title: 'Outcomes leadership teams can put in front of the board.',
    items: [
      { value: 2.4, prefix: '\u00A3', suffix: 'B+', decimals: 1, label: 'Programme value governed' },
      { value: 40, suffix: '+', decimals: 0, label: 'Enterprise transformations' },
      { value: 7, suffix: '', decimals: 0, label: 'Regulated industries served' },
      { value: 99.4, suffix: '%', decimals: 1, label: 'Delivery confidence index' },
    ],
  },
  founder: {
    eyebrow: 'THE PRINCIPAL',
    role: 'Founder & Principal Consultant',
    name: 'Adrian Vale',
    bio: 'Two decades leading enterprise transformation, programme governance and AI-enabled delivery for governments and Fortune-class institutions. Virellis is the studio built to make complex change predictable \u2014 pairing executive judgement with intelligent systems.',
    quote: 'Complexity is not the enemy. Unmanaged complexity is. My work is turning ambiguity into a delivery model the board can trust.',
    image:
      'https://images.unsplash.com/photo-1542190891-2093d38760f2?fm=jpg&q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZXhlY3V0aXZlJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
    stats: [
      { k: '20+', v: 'Years leading delivery' },
      { k: 'C-suite', v: 'Advisory & assurance' },
      { k: 'Global', v: 'Multi-region programmes' },
    ],
  },
  command: {
    eyebrow: 'THE COMMAND CENTER',
    title: 'Step inside the enterprise transformation command center.',
    subtitle:
      'A conversational AI concierge, live portfolio telemetry and a governance operating model \u2014 arriving as the next rooms in the Virellis headquarters.',
    cta: 'Book a Strategy Session',
    modules: ['AI Concierge', 'Live PMO Dashboard', 'Governance Room', 'Delivery Framework'],
  },
  footer: {
    tagline: 'Where Enterprise Transformation Meets Intelligent Delivery.',
    columns: [
      { title: 'Studio', links: ['Strategy', 'Governance', 'Delivery', 'AI Adoption'] },
      { title: 'Firm', links: ['Founder', 'Approach', 'Insights', 'Contact'] },
      { title: 'Command Center', links: ['AI Concierge', 'PMO Dashboard', 'Frameworks', 'Playbooks'] },
    ],
  },
};
