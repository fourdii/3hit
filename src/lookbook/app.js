import * as THREE from 'three'
import React, { Suspense, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree , useLoader, extend} from '@react-three/fiber'
import { useTexture, ScrollControls, Scroll, useScroll, Preload } from '@react-three/drei'


class CustomMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
       uniforms:
  {
    uTime: {  type: "f", value: 0.0 },
    uTexture:  { type: "t", value: undefined },
  },
  vertexShader: `
    precision mediump float;
 
    varying vec2 vUv;
    varying float vWave;
    uniform float uTime;

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      
      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      
      // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
               
      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
    
      vec3 pos = position;
      float noiseFreq = 3.5;
      float noiseAmp = 0.15; 
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise(noisePos) * noiseAmp;
      vWave = pos.z;
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
  `,
  fragmentShader: `
    precision mediump float;

    varying vec2 vUv;
    varying float vWave;
    uniform sampler2D uTexture;


    void main() {
      float wave = vWave * 0.5;
      vec3 texture = texture(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.);
    }
  `
    })
  }

}

extend({ CustomMaterial })

function Image({position, scale, url}) {
  const ref = useRef()
  const group = useRef()
  const data = useScroll()
  const [texture] = useLoader(THREE.TextureLoader, [url]);
  const [hovered, setHover] = useState(false)
  
  useFrame(({delta, clock}) => {
    //group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta)

    if(hovered)
    {
      ref.current.uniforms.uTime.value = clock.getElapsedTime();
    }

  })

  return (
    <group ref={group} >
      <mesh  
      position={position} 
      scale={scale}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      // onMouseEnter={hover}
      // onMouseLeave={unhover}
      // onTouchStart={hover}
      // onTouchEnd={unhover}
      // onTouchCancel={unhover}
      >
      <planeBufferGeometry args={[1, 1.5, 8, 12]} />
      <customMaterial       
       attach="material"
       ref={ref} 
      //  args={[WaterShader]}
       uniforms-uTexture-value={texture}
      />
      </mesh>
    </group>
  );
}

function Page({ m = 0.4, urls, ...props }) {
  const { width } = useThree((state) => state.viewport)
  const w = width < 10 ? 2 / 3 : 1 / 3

  return (
    <group {...props}>

      <Image  position={[-width * w, 0, -1]} scale={[3, 3, 3]} url={urls[0]} />
      <Image  position={[0, 0, 0]} scale={[3, 3, 3]} url={urls[1]} />
      <Image  position={[width * w, 0, 1]} scale={[3, 3, 3]} url={urls[2]} />

      {/* <Image   position={[-width * w, 0, -1]} scale={[width * w - m * 2, (width * w - m * 2) * 1.5 , 1]} url={urls[0]} />
      <Image   position={[0, 0, 0]} scale={[width * w - m * 2, (width * w - m * 2) * 1.5, 1]} url={urls[1]} />
      <Image   position={[width * w, 0, 1]} scale={[width * w - m * 2, (width * w - m * 2) * 1.5, 1]} url={urls[2]} /> */}
    </group>
  )
}

function Pages() {
  const { width } = useThree((state) => state.viewport)
  return (
    <>
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
      <Page position={[width * 10, 0, 0]} urls={['lookbook/look11_3.jpg', 'lookbook/look11_1.jpg', 'lookbook/look11_2.jpg']} />     
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
            {/* <img src='/biologist/fire_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '-75vw' }}/>
            <img src='/biologist/gold_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '25vw' }}/>
            <img src='/biologist/aqua_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '125vw' }}/>
            <img src='/biologist/wood_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '225vw' }}/>
            <img src='/biologist/dirt_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '325vw' }}/>
            <img src='/taichi.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '425vw' }}/>
            <img src='/biologist/fire_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '525vw' }}/>
            <img src='/biologist/gold_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '625vw' }}/>
            <img src='/biologist/aqua_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '725vw' }}/>
            <img src='/biologist/wood_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '825vw' }}/>
            <img src='/biologist/dirt_nobg.png' style={{ width: '100px', height: '100px', position: 'absolute', top: '20vh', left: '925vw' }}/> */}

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
