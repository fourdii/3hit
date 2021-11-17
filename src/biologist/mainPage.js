import React, { Suspense, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import planetData from "./planetData.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useHistory } from "react-router-dom";


export default function MainPage() {

  const history = useHistory();

  function Sun() {
    const texture = useLoader(THREE.TextureLoader, "/biologist/sun_tex.jpg");
    return (
      <mesh>
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
    },
    
  }) {
   
    


    const planetRef = React.useRef();
    const texture = useLoader(THREE.TextureLoader, textureMap);
    const gltf = useLoader(GLTFLoader, meshMap);


    gltf.scene.traverse( function( object ) {

      if ( object.isMesh ) {
  
          object.material.color.set( colorMap );
          object.material.transparent = true;
          object.material.opacity = 0.9;
          object.material.bumpMap = texture;
      }
  
  } );

 useFrame(({ clock }) => {          
        const t = clock.getElapsedTime() * speed + offset;
        const x = xRadius * Math.sin(t);
        const z = zRadius * Math.cos(t);              
        planetRef.current.position.x = x;
        planetRef.current.position.z = z;
        planetRef.current.rotation.y += rotationSpeed;            
    });
  

    
    return (
      <>
        <mesh         
          ref={planetRef}
          onClick={() => {
            location.href = '/biologistFire.html';      
          }}
        >
          <primitive object={gltf.scene} position={[0, 0, 0]} />
        </mesh>
        <Ecliptic xRadius={xRadius} zRadius={zRadius} />
      </>
    );
  }
  
  function Lights() {
    return (
      <>
        <ambientLight />
        <pointLight position={[0, 0, 0]} />
      </>
    );
  }
  
  function Ecliptic({ xRadius = 1, zRadius = 1 }) {
    const points = [];
    for (let index = 0; index < 64; index++) {
      const angle = (index / 64) * 2 * Math.PI;
      const x = xRadius * Math.cos(angle);
      const z = zRadius * Math.sin(angle);
      points.push(new THREE.Vector3(x, 0, z));
    }
  
    points.push(points[0]);
  
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color="#393e46" linewidth={10} />
      </line>
    );
  }

  return (
    <>    
      <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
        <Suspense fallback={null}>
           <Sun /> 
          {planetData.map((planet) => (
            <Planet planet={planet} key={planet.id} />
          ))}
          {/* <Lights /> */}
          <Environment preset="warehouse" />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </>
  );
}


