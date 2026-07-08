'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ComplexitySphere from './ComplexitySphere'
import StarField from './StarField'

export default function Scene3D() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 45 }}
    >
      <Suspense fallback={null}>
        <StarField />
        <ComplexitySphere />
      </Suspense>
    </Canvas>
  )
}
