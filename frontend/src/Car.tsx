import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import * as THREE from "three";

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
};

const Car: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/car.glb") as GLTFResult;

  return (
    <group ref={group} dispose={null} position={[3, 0, -1]} rotation={[0, -Math.PI / 4, 0]} scale={1.1}>
      <primitive object={scene} />
    </group>
  );
};

export default Car;

useGLTF.preload("/models/car.glb");
