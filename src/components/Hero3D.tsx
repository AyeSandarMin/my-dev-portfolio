import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

function Avatar() {
  const modelRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/avatar.glb')
  
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  return (
    <group ref={modelRef} position={[0, -0.1, 0]} scale={0.0105}>
      <primitive object={scene} />
    </group>
  )
}

export default function Hero3D() {
  useEffect(() => {
    // Set initial state - hidden and positioned above
    // Animation will be triggered by the master timeline in App.tsx
    gsap.set("#header-asdm", { opacity: 0, y: -20 })
  }, [])

  return (
    <div className="w-full h-screen flex flex-col bg-white relative">
      <div className="flex justify-center items-center pt-6 absolute w-full z-10">
        <h6 id="header-asdm">ASDM</h6>
      </div>
      <Canvas
        camera={{ position: [0, 1.3, 2.2], fov: 35 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        <Suspense fallback={null}>
          <Avatar />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            target={[0, 1.5, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}