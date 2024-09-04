import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CharacterProps {
  modelPath: string;
  currentAnimation: string | null;
  onAnimationsLoaded: (animations: string[]) => void;
}

export default function Character({ modelPath, currentAnimation, onAnimationsLoaded }: CharacterProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, animations } = useGLTF(modelPath);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    onAnimationsLoaded(names);
  }, [names, onAnimationsLoaded]);

  useEffect(() => {
    if (currentAnimation && actions[currentAnimation]) {
      Object.values(actions).forEach((action) => action?.stop());
      actions[currentAnimation].play();
    } else if (currentAnimation === null) {
      Object.values(actions).forEach((action) => action?.stop());
    }
  }, [actions, currentAnimation]);

  useFrame((state) => {
    if (group.current && !currentAnimation) {
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
