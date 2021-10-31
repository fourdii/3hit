import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import {  useFrame } from '@react-three/fiber'
import * as THREE from 'three'


export default function Wood({ random, ...props }) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('/model/wood.glb')
  const [hovered, setHover] = useState(false)


  useFrame((state) => {
    const t = state.clock.getElapsedTime() + random * 10000
    ref.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2)
    ref.current.position.y = Math.sin(t / 1.5) / 2
    ref.current.scale.x = ref.current.scale.y = ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 1.4 : 1, 0.1)
    // ref.current.color.lerp(color.set(hovered ? 'red' : 'white'), hovered ? 1 : 0.1)
  })



  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.RetopoFlow002.geometry}
        material={nodes.RetopoFlow002.material}
      />
    </group>
  );
}

// useGLTF.preload('/model/wood.glb')