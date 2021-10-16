import React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

function useScreen() {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useEffect(() => {
    function onResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

function rad2deg(rad) {
  return rad * (180 / Math.PI);
}

const DISTANCE = 1000;

function Camera() {
  const { height } = useScreen();
  const fov = React.useMemo(() => {
    return 2 * rad2deg(Math.atan(height / 2 / DISTANCE));
  }, [height]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={fov}
        position={[0, 0, DISTANCE / (Math.PI * 0.5)]}
        near={DISTANCE / 100}
        far={DISTANCE * 100}
      />
      <OrbitControls
        minDistance={DISTANCE / (Math.PI * 0.5)}
        maxDistance={DISTANCE * (Math.PI * 0.5)}
        enableDamping={false}
        zoomSpeed={1}
      />
    </>
  );
}

const video = document.createElement("video");
video.src =
  "https://storage.finervision.com/public/facebook-area-404/tests/lobby.mp4";
video.muted = true;
video.loop = true;
video.crossOrigin = "Anonymous";
video.play();

function Scene() {
  const { width, height } = useScreen();
  const maxDimension = React.useMemo(() => {
    if (width >= height) return "width";
    return "height";
  }, [width, height]);
  const size = React.useMemo(() => {
    const ratios = {
      width: 2,
      height: 0.5
    };
    let newWidth = width;
    let newHeight = width * ratios.height;
    if (maxDimension === "height") {
      newWidth = height * ratios.width;
      newHeight = height;
    }
    return { width: newWidth, height: newHeight };
  }, [maxDimension, width, height]);

  return (
    <scene>
      <mesh position={[0, 0, 0]} scale={[-1, 1, 1]}>
        <sphereBufferGeometry
          args={[size.width, size.height, 40]}
          attach="geometry"
        />
        <meshBasicMaterial
          toneMapped={false}
          attach="material"
          side={THREE.DoubleSide}
        >
          <videoTexture
            attach="map"
            args={[video]}
            encoding={THREE.sRGBEncoding}
          />
        </meshBasicMaterial>
      </mesh>
    </scene>
  );
}

export default function VideoPage() {
  return (
    <React.Suspense fallback="Loading...">
      <Canvas>
        <Scene />
        <Camera />
        <ambientLight />
      </Canvas>
    </React.Suspense>
  );
}
