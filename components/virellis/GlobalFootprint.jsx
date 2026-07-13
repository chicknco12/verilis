'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useInView } from 'framer-motion'
import { MapPin, Building2, Layers, Globe2 } from 'lucide-react'
import { content } from '@/lib/virellis/content'

const PURPLE = '#6C2BD9'
const PURPLE_LIGHT = '#B084F5'
const GOLD = '#C9A86A'
const R = 2

function latLonToVec3(lat, lon, r) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

/* ---------- Hologram globe (sphere + wireframe + atmosphere) ---------- */
function Globe() {
  return (
    <group>
      {/* solid navy core */}
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color={'#12102a'} transparent opacity={0.92} />
      </mesh>
      {/* latitude / longitude wireframe */}
      <mesh>
        <sphereGeometry args={[R, 36, 24]} />
        <meshBasicMaterial color={PURPLE} wireframe transparent opacity={0.22} />
      </mesh>
      {/* subtle dotted fresnel shell */}
      <mesh>
        <sphereGeometry args={[R * 1.005, 64, 48]} />
        <meshBasicMaterial color={PURPLE_LIGHT} wireframe transparent opacity={0.05} />
      </mesh>
      {/* atmosphere glow */}
      <mesh>
        <sphereGeometry args={[R * 1.14, 48, 48]} />
        <meshBasicMaterial color={PURPLE} transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

/* ---------- Marker: glowing dot + pulsing ring ---------- */
function Marker({ location, active, dimmed, onSelect }) {
  const pos = useMemo(() => latLonToVec3(location.lat, location.lon, R * 1.01), [location])
  const ringRef = useRef()
  const ringMatRef = useRef()
  const dotRef = useRef()
  const color = active ? GOLD : PURPLE_LIGHT

  // orient ring tangent to sphere surface
  const quat = useMemo(() => {
    const q = new THREE.Quaternion()
    const normal = pos.clone().normalize()
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    return q
  }, [pos])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = (t * 0.6 + (location.lat + location.lon)) % 2
    if (ringRef.current && ringMatRef.current) {
      const s = 1 + p * 1.6
      ringRef.current.scale.setScalar(s)
      ringMatRef.current.opacity = Math.max(0, (1 - p / 2)) * (dimmed ? 0.15 : 0.6)
    }
    if (dotRef.current) {
      const b = 1 + Math.sin(t * 2 + location.lon) * 0.15
      dotRef.current.scale.setScalar((active ? 1.5 : 1) * b)
    }
  })

  return (
    <group position={pos}>
      {/* pulsing ring */}
      <mesh ref={ringRef} quaternion={quat}>
        <ringGeometry args={[0.05, 0.075, 32]} />
        <meshBasicMaterial ref={ringMatRef} color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* clickable dot */}
      <mesh
        ref={dotRef}
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={dimmed ? 0.3 : 1} />
      </mesh>
      {/* glow halo */}
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={dimmed ? 0.05 : 0.25} />
      </mesh>
    </group>
  )
}

function GlobeScene({ locations, selectedIndex, filter, onSelect }) {
  const groupRef = useRef()
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.06
  })
  return (
    <>
      <ambientLight intensity={0.6} />
      <group ref={groupRef}>
        <Globe />
        {locations.map((loc, i) => {
          const matches = !filter || loc.industries.includes(filter)
          return (
            <Marker
              key={loc.city}
              location={loc}
              active={selectedIndex === i}
              dimmed={!matches}
              onSelect={() => onSelect(i)}
            />
          )
        })}
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
      />
    </>
  )
}

/* ---------- Animated counter ---------- */
function Counter({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const dur = 1600
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

export default function GlobalFootprint() {
  const fp = content.footprint
  const [selected, setSelected] = useState(0)
  const [filter, setFilter] = useState(null)

  const loc = fp.locations[selected]

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Globe */}
        <div className="lg:col-span-3">
          <div
            className="relative h-[420px] md:h-[520px] overflow-hidden rounded-[1.75rem] border border-white/8"
            style={{ background: 'radial-gradient(120% 120% at 50% 30%, rgba(108,43,217,0.16) 0%, rgba(21,21,42,0.55) 45%, rgba(8,9,12,0.9) 100%)' }}
          >
            <Canvas camera={{ position: [0, 0.6, 6], fov: 45 }} dpr={[1, 1.8]}>
              <GlobeScene
                locations={fp.locations}
                selectedIndex={selected}
                filter={filter}
                onSelect={setSelected}
              />
            </Canvas>
            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 text-[10px] tracking-[0.3em] text-white/40">
              <Globe2 className="h-3.5 w-3.5 text-[#B084F5]" /> DRAG TO ROTATE
            </div>
          </div>

          {/* Industry filters */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-white/40">
              <Layers className="h-3.5 w-3.5" /> FILTER
            </span>
            <button
              onClick={() => setFilter(null)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                !filter ? 'border-[#B084F5]/70 bg-[#6C2BD9]/25 text-white' : 'border-white/10 text-white/60 hover:text-white'
              }`}
            >
              All
            </button>
            {fp.industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setFilter(ind === filter ? null : ind)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                  filter === ind ? 'border-[#B084F5]/70 bg-[#6C2BD9]/25 text-white' : 'border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Selected location detail */}
        <div className="lg:col-span-2">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full overflow-hidden rounded-[1.75rem] border border-white/8 p-7"
            style={{ background: 'linear-gradient(160deg, rgba(21,21,42,0.8) 0%, rgba(12,12,22,0.6) 100%)' }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#6C2BD9]/30 blur-[70px]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#B084F5]">
                <MapPin className="h-3.5 w-3.5" /> ENGAGEMENT LOCATION
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white">{loc.city}</h3>
              <div className="text-sm text-white/50">{loc.country}</div>

              <div className="mt-6">
                <div className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-white/40">
                  <Building2 className="h-3 w-3" /> ENTERPRISES
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {loc.companies.map((c) => (
                    <span key={c} className="rounded-md border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs text-gold">{c}</span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-[10px] tracking-[0.25em] text-white/40">TRANSFORMATIONS</div>
                <ul className="mt-2 space-y-1.5">
                  {loc.projects.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#B084F5]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {loc.industries.map((ind) => (
                  <span key={ind} className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/55">{ind}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Metrics dashboard */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {fp.metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="rounded-2xl border border-white/8 bg-[#15152A]/50 p-5 text-center backdrop-blur"
          >
            <div className="font-display text-2xl md:text-3xl font-semibold" style={{ color: PURPLE_LIGHT }}>
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
            </div>
            <div className="mt-2 text-[11px] leading-tight text-white/50">{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Signature engagements */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {fp.engagements.map((e, i) => (
          <motion.div
            key={e.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-white/8 p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#B084F5]/40"
            style={{ background: 'linear-gradient(150deg, rgba(21,21,42,0.7) 0%, rgba(12,12,22,0.5) 100%)' }}
          >
            <div className="pointer-events-none absolute -right-14 -bottom-14 h-36 w-36 rounded-full bg-[#6C2BD9]/25 blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative">
              <h4 className="font-display text-lg font-semibold tracking-tight text-white">{e.title}</h4>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <span className="text-[10px] tracking-[0.25em] text-white/40">CHALLENGE</span>
                  <p className="mt-1 text-white/65">{e.challenge}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.25em] text-white/40">APPROACH</span>
                  <p className="mt-1 text-white/65">{e.approach}</p>
                </div>
                <div className="flex items-start gap-2 rounded-xl border border-gold/20 bg-gold/[0.06] p-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span className="text-gold/90">{e.outcome}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
