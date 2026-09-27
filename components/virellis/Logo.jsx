'use client'

// Themed reinterpretation of the Virellis "V" mark (two intersecting bands),
// recoloured from purple/gold to the blue/indigo light theme.
export default function LogoMark({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="vGradA" x1="6" y1="6" x2="26" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="vGradB" x1="42" y1="6" x2="22" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      {/* left band */}
      <path d="M9 7 L16 7 L27 41 L20 41 Z" fill="url(#vGradA)" />
      {/* right band */}
      <path d="M39 7 L32 7 L21 41 L28 41 Z" fill="url(#vGradB)" />
      {/* intersection highlight */}
      <path d="M20 41 L24 29 L28 41 Z" fill="#1D4ED8" opacity="0.9" />
    </svg>
  )
}
