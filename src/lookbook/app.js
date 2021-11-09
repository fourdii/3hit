import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Preload, Image as ImageImpl } from '@react-three/drei'






function Image(props) {
  const ref = useRef()
  const group = useRef()
  const data = useScroll()
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta)
    // ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, Math.max(0, 1 - data.delta * 1000), 4, delta)
  })
  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} />
    </group>
  )
}

function Page({ m = 0.4, urls, ...props }) {
  const { width } = useThree((state) => state.viewport)
  const w = width < 10 ? 1.5 / 3 : 1 / 3
  return (
    <group {...props}>
      <Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
      <Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} />
      <Image position={[width * w, 0, 1]} scale={[width * w - m * 2, 5, 1]} url={urls[2]} />
    </group>
  )
}

function Pages() {
  const { width } = useThree((state) => state.viewport)
  return (
    <>
      <Page position={[-width * 1, 0, 0]} urls={['lookbook/look11_3.jpg', 'lookbook/look11_1.jpg', 'lookbook/look11_2.jpg']} />
      <Page position={[width * 0, 0, 0]} urls={['lookbook/look1_3.jpg', 'lookbook/look1_1.jpg', 'lookbook/look1_2.jpg']} />
      <Page position={[width * 1, 0, 0]} urls={['lookbook/look2_3.jpg', 'lookbook/look2_1.jpg', 'lookbook/look2_2.jpg']} />    
      <Page position={[width * 2, 0, 0]} urls={['lookbook/look3_3.jpg', 'lookbook/look3_1.jpg', 'lookbook/look3_2.jpg']} />      
      <Page position={[width * 3, 0, 0]} urls={['lookbook/look4_3.jpg', 'lookbook/look4_1.jpg', 'lookbook/look4_2.jpg']} />      
      <Page position={[width * 4, 0, 0]} urls={['lookbook/look5_3.jpg', 'lookbook/look5_1.jpg', 'lookbook/look5_2.jpg']} />      
      <Page position={[width * 5, 0, 0]} urls={['lookbook/look6_3.jpg', 'lookbook/look6_1.jpg', 'lookbook/look6_2.jpg']} />      
      <Page position={[width * 6, 0, 0]} urls={['lookbook/look7_3.jpg', 'lookbook/look7_1.jpg', 'lookbook/look7_2.jpg']} />      
      <Page position={[width * 7, 0, 0]} urls={['lookbook/look8_3.jpg', 'lookbook/look8_1.jpg', 'lookbook/look8_2.jpg']} />      
      <Page position={[width * 8, 0, 0]} urls={['lookbook/look9_3.jpg', 'lookbook/look9_1.jpg', 'lookbook/look9_2.jpg']} />      
      <Page position={[width * 9, 0, 0]} urls={['lookbook/look10_3.jpg', 'lookbook/look10_1.jpg', 'lookbook/look10_2.jpg']} />      
    </>
  )
}

export default function App() {
  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ScrollControls infinite horizontal damping={4} pages={9} distance={1}>
          <Scroll>
            <Pages />
          </Scroll>
          <Scroll html>
            {/* <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '-75vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '25vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '125vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '225vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '325vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '425vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '525vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '625vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '725vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '825vw' }}/>
            <img src='../img/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '925vw' }}/> */}

            {/* <h1 style={{ position: 'absolute', top: '20vh', left: '-75vw' }}>look1</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '25vw' }}>look2</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '125vw' }}>look3</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '225vw' }}>look4</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '325vw' }}>look5</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '425vw' }}>look6</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '525vw' }}>look7</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '625vw' }}>look8</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '725vw' }}>look9</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '825vw' }}>look10</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '925vw' }}>look11</h1> */}
          </Scroll>
        </ScrollControls>
        <Preload />
      </Suspense>
    </Canvas>
  )
}
