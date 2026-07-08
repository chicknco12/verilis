'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollStore } from '@/lib/virellis/scrollStore'

const COUNT = 2600
const DOMAINS = 8
const SPHERE_R = 3.1
const MAX_EDGES = 1300

// Refined luxury palette mapped to the 8 transformation domains
// (champagne gold tones + electric blue tones + near-white)
const PALETTE = [
  '#E4CE9B', '#C8A96A', '#7FB0FF', '#4D8DFF',
  '#EDE4CF', '#9CC0FF', '#D9BE82', '#5E97FF',
]

function fibPoint(i, n, r) {
  const y = 1 - (i / (n - 1)) * 2
  const rad = Math.sqrt(Math.max(0, 1 - y * y))
  const theta = Math.PI * (3 - Math.sqrt(5)) * i
  return new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r)
}

const vertexShader = `
  uniform float uTime;
  uniform float uSize;
  attribute float aPhase;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    vColor = color;
    vGlow = 0.5 + 0.5 * sin(uTime * 1.4 + aPhase);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (0.55 + vGlow * 0.95) * (10.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = `
  precision mediump float;
  varying vec3 vColor;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= 0.35 + 0.65 * vGlow;
    gl_FragColor = vec4(vColor * (1.1 + vGlow * 0.6), alpha);
  }
`

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 160
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(80, 80, 0, 80, 80, 80)
  g.addColorStop(0, 'rgba(200,169,106,0.55)')
  g.addColorStop(0.28, 'rgba(120,140,190,0.20)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 160, 160)
  return new THREE.CanvasTexture(c)
}

export default function ComplexitySphere() {
  const groupRef = useRef()
  const pointsRef = useRef()
  const lineRef = useRef()
  const lineMatRef = useRef()
  const glowRef = useRef()

  const data = useMemo(() => {
    const centers = []
    for (let d = 0; d < DOMAINS; d++) {
      centers.push(fibPoint(d, DOMAINS, 1).normalize().multiplyScalar(7.4))
    }

    const basePos = new Float32Array(COUNT * 3)
    const explodedPos = new Float32Array(COUNT * 3)
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const phases = new Float32Array(COUNT)
    const domainOf = new Int32Array(COUNT)
    const col = new THREE.Color()
    const dir = new THREE.Vector3()

    for (let i = 0; i < COUNT; i++) {
      const p = fibPoint(i, COUNT, SPHERE_R)
      p.x += (Math.random() - 0.5) * 0.14
      p.y += (Math.random() - 0.5) * 0.14
      p.z += (Math.random() - 0.5) * 0.14
      basePos[i * 3] = p.x; basePos[i * 3 + 1] = p.y; basePos[i * 3 + 2] = p.z
      positions[i * 3] = p.x; positions[i * 3 + 1] = p.y; positions[i * 3 + 2] = p.z

      dir.copy(p).normalize()
      let best = 0, bd = -2
      for (let d = 0; d < DOMAINS; d++) {
        const cd = centers[d].clone().normalize().dot(dir)
        if (cd > bd) { bd = cd; best = d }
      }
      domainOf[i] = best

      const off = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      off.normalize().multiplyScalar(Math.pow(Math.random(), 0.5) * 1.5)
      explodedPos[i * 3] = centers[best].x + off.x
      explodedPos[i * 3 + 1] = centers[best].y + off.y
      explodedPos[i * 3 + 2] = centers[best].z + off.z

      col.set(PALETTE[best])
      colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b
      phases[i] = Math.random() * Math.PI * 2
    }

    // nearest-neighbour edges within the same domain (computed once)
    const edgeIdx = []
    for (let i = 0; i < COUNT && edgeIdx.length < MAX_EDGES * 2; i++) {
      let nn = -1, nd = Infinity
      const ax = basePos[i * 3], ay = basePos[i * 3 + 1], az = basePos[i * 3 + 2]
      for (let j = 0; j < COUNT; j++) {
        if (j === i || domainOf[j] !== domainOf[i]) continue
        const dx = basePos[j * 3] - ax, dy = basePos[j * 3 + 1] - ay, dz = basePos[j * 3 + 2] - az
        const dd = dx * dx + dy * dy + dz * dz
        if (dd < nd) { nd = dd; nn = j }
      }
      if (nn > i) { edgeIdx.push(i, nn) }
    }
    const edges = new Uint16Array(edgeIdx)
    const edgePos = new Float32Array(edges.length * 3)

    return { basePos, explodedPos, positions, colors, phases, edges, edgePos }
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uSize: { value: 15.0 } },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  const glowTex = useMemo(() => makeGlowTexture(), [])

  useFrame((state, delta) => {
    const d = Math.min(1, delta * 3)
    scrollStore.progress += (scrollStore.target - scrollStore.progress) * d
    const t = scrollStore.progress
    const et = t * t * (3 - 2 * t) // smoothstep
    const time = state.clock.elapsedTime
    const { basePos, explodedPos } = data

    const posAttr = pointsRef.current.geometry.attributes.position
    const arr = posAttr.array
    for (let i = 0; i < COUNT; i++) {
      const breathe = 1 + Math.sin(time * 0.6 + data.phases[i]) * 0.02
      const sx = basePos[i * 3] * breathe
      const sy = basePos[i * 3 + 1] * breathe
      const sz = basePos[i * 3 + 2] * breathe
      arr[i * 3] = sx + (explodedPos[i * 3] - sx) * et
      arr[i * 3 + 1] = sy + (explodedPos[i * 3 + 1] - sy) * et
      arr[i * 3 + 2] = sz + (explodedPos[i * 3 + 2] - sz) * et
    }
    posAttr.needsUpdate = true

    const lpos = lineRef.current.geometry.attributes.position.array
    const edges = data.edges
    for (let k = 0; k < edges.length; k++) {
      const idx = edges[k]
      lpos[k * 3] = arr[idx * 3]
      lpos[k * 3 + 1] = arr[idx * 3 + 1]
      lpos[k * 3 + 2] = arr[idx * 3 + 2]
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true
    if (lineMatRef.current) lineMatRef.current.opacity = 0.16 * (1 - et)
    if (glowRef.current) glowRef.current.material.opacity = 0.9 * (1 - et * 0.85)

    material.uniforms.uTime.value = time

    const g = groupRef.current
    g.rotation.y += delta * 0.05
    g.rotation.x += ((-scrollStore.mouseY * 0.22) - g.rotation.x) * 0.04
    g.position.x += ((scrollStore.mouseX * 0.5) - g.position.x) * 0.04

    // cinematic dolly as the system disassembles
    const cam = state.camera
    cam.position.z += ((9 + et * 5.5) - cam.position.z) * 0.04
    cam.position.y += ((et * 1.4) - cam.position.y) * 0.04
    cam.lookAt(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      <sprite ref={glowRef} scale={[10, 10, 1]}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.9} />
      </sprite>

      <points ref={pointsRef} material={material}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
        </bufferGeometry>
      </points>

      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.edgePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
          color={'#8fa6c8'}
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}
