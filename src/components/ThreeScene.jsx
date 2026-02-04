import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 600 }) {
  const mesh = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 6
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y += 0.0007
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime / 6) * 0.02
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={'#0a66c2'} sizeAttenuation />
    </points>
  )
}

export default function ThreeScene({ lowPerf = false }) {
  if (lowPerf) return <img src="/assets/images/hero-poster.jpg" alt="Hero static" style={{ width: '100%' }} />

  return (
    <div style={{ width: '100%', height: 360 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <Suspense fallback={null}>
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  )
}
