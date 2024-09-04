import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Object3D };
  materials: { [key: string]: THREE.Material };
};

interface ModelProps {
  modelPath: string;
  currentAnimation: string | null;
}

const Model: React.FC<ModelProps> = ({ modelPath, currentAnimation }) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, animations } = useGLTF(modelPath) as GLTFResult;
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (currentAnimation && actions[currentAnimation]) {
      // Stop all currently playing animations
      Object.values(actions).forEach((action) => action?.stop());

      // Play the new animation
      actions[currentAnimation].reset().fadeIn(0.5).play();
    }
  }, [actions, currentAnimation]);

  useFrame(() => {
    if (currentAnimation && actions[currentAnimation]) {
      actions[currentAnimation].timeScale = 1; // Ensure animation plays at normal speed
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Scene} />
    </group>
  );
};

export default Model;
