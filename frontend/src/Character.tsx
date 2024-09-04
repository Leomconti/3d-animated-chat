import { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Character({ modelPath }: { modelPath: string }) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      group.current.rotation.y = Math.sin(t / 2) / 8;
      group.current.position.y = Math.sin(t / 1.5) / 10;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Scene} />
    </group>
  );
}

useGLTF.preload("/models/my_model.glb");
