import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Bounds, useBounds, Environment, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import planetData from "./planetData.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useHistory } from "react-router-dom";


export default function MainPage() {

  const history = useHistory();

  function Sun() {
    const texture = useLoader(THREE.TextureLoader, "/biologist/sun_tex.jpg");
    const planetRef = React.useRef();


    useFrame(({ clock }) => {          
      // const t = clock.getElapsedTime() * 0.01 + 0;
      // const x = 6 * Math.sin(t);
      // const z = 3 * Math.cos(t);              
      // planetRef.current.position.x = x;
      // planetRef.current.position.z = z;
      //planetRef.current.rotation.y += 0.01;            
  });


    return (
      <mesh ref={planetRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    );
  }
  
  function Planet({
    planet: {
      color,
      xRadius,
      zRadius,
      size,
      speed,
      offset,
      rotationSpeed,
      textureMap,
      meshMap,
      name,
      gravity,
      orbitalPeriod,
      surfaceArea,
      colorMap,
      htmlMap,
      posMap,
      rotMap
    },
    
  }) {
   
    
    const planetRef = React.useRef();
    const texture = useLoader(THREE.TextureLoader, textureMap);
    const gltf = useLoader(GLTFLoader, meshMap);


    gltf.scene.traverse( function( object ) {

      if ( object.isMesh ) {
  
          object.material.color.set( colorMap );
          object.material.transparent = true;
          object.material.opacity = 1;
          object.material.bumpMap = texture;
      }
  
  } );

//  useFrame(({ clock }) => {          
//         const t = clock.getElapsedTime() * speed + offset;
//         const x = xRadius * Math.sin(t);
//         const z = zRadius * Math.cos(t);              
//         planetRef.current.position.x = x;
//         planetRef.current.position.z = z;
//         planetRef.current.rotation.y += rotationSpeed;            
//     });
  

    const group = useRef();
    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        Math.cos(t / 2) / 10 + 0.25,
        0.1
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        Math.sin(t / 4) / 10,
        0.1
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        Math.sin(t / 4) / 20,
        0.1
      );
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        (-5 + Math.sin(t)) / 5,
        0.1
      );
    });

    
    return (
      
      <group ref={group} position={posMap} rotation={rotMap} scale={[2,2,2]} dispose={null}>
        <mesh
          ref={planetRef}
          // onClick={() => {
          //   location.href = htmlMap;
          // }}
        >
          <primitive object={gltf.scene} />
        </mesh>
        {/* <Html distanceFactor={20}>
        <div class="content">
          hello <br />
          world
        </div>
      </Html> */}
        {/* <Ecliptic xRadius={xRadius} zRadius={zRadius} /> */}
      </group>
     
    );
  }
  
  // function Lights() {
  //   return (
  //     <>
  //       <ambientLight />
  //       <pointLight position={[0, 0, 0]} />
  //     </>
  //   );
  // }
  
  // function Ecliptic({ xRadius = 1, zRadius = 1 }) {
  //   const points = [];
  //   for (let index = 0; index < 64; index++) {
  //     const angle = (index / 64) * 2 * Math.PI;
  //     const x = xRadius * Math.cos(angle);
  //     const z = zRadius * Math.sin(angle);
  //     points.push(new THREE.Vector3(x, 0, z));
  //   }
  
  //   points.push(points[0]);
  
  //   const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  //   return (
  //     <line geometry={lineGeometry}>
  //       <lineBasicMaterial attach="material" color="#393e46" linewidth={10} />
  //     </line>
  //   );
  // }


  function SelectToZoom({ children }) {
    const api = useBounds()
    return (
      <group onClick={(e) => (e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit())} onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}>
        {children}
      </group>
    )
  }


  return (
    <>
      <Canvas camera={{ position: [0, 5, 10], fov: 30 }}>
        <Suspense fallback={null}>
          <Bounds fit clip margin={1.2}>
            <SelectToZoom>
              <Sun />
              {planetData.map((planet) => (
                <Planet planet={planet} key={planet.id} />
              ))}
            </SelectToZoom>
          </Bounds>
          {/* <Lights /> */}
          <Environment preset="warehouse" />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </>
  );
}


