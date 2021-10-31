import React from "react";
import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Instances, Instance, OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import  Wood  from './wood'

const color = new THREE.Color()
const randomVector = (r) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r]
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
const randomData = Array.from({ length: 100 }, (r = 10) => ({ random: Math.random(), position: randomVector(r), rotation: randomEuler() }))

export default function App() {
  const { range } = useControls({ range: { value: 5, min: 0, max: 10, step: 1 } })
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 50 }} performance={{ min: 0.1 }}>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.3} position={[5, 25, 20]} />
      <Suspense fallback={null}>
        <Models range={range} />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls autoRotate autoRotateSpeed={1} />
    </Canvas>
  )
}

function Models({ range }) {
  // const { nodes, materials } = useGLTF('../model/shoe.glb')
  return (
    // <Instances range={range} material={materials.phong1SG} geometry={nodes.Shoe.geometry}>
      randomData.map((props, i) => (
        <Wood key={i} {...props} />
        // <Model key={i} {...props} />
      ))
    // </Instances>
  )
}

function Model({ random, ...props }) {
    const ref = useRef()
    const [hovered, setHover] = useState(false)
    useFrame((state) => {
      const t = state.clock.getElapsedTime() + random * 10000
      ref.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2)
      ref.current.position.y = Math.sin(t / 1.5) / 2
      ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 1.4 : 1, 0.1)
      ref.current.color.lerp(color.set(hovered ? 'red' : 'white'), hovered ? 1 : 0.1)
    })
    return (
      <group {...props}>
        <Instance ref={ref} onPointerOver={(e) => (e.stopPropagation(), setHover(true))} onPointerOut={() => setHover(false)} />
      </group>
  )
}
