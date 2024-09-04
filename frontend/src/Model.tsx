import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Object3D };
  materials: { [key: string]: THREE.Material };
};

interface ModelProps {
  modelPath: string;
  currentAnimation: string | null;
  onAnimationsLoaded: (animations: string[]) => void;
}

const Model: React.FC<ModelProps> = ({ modelPath, currentAnimation, onAnimationsLoaded }) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, animations } = useGLTF(modelPath) as GLTFResult;
  const { actions, names } = useAnimations(animations, group);
  const [previousAnimation, setPreviousAnimation] = useState<string | null>(null);

  useEffect(() => {
    onAnimationsLoaded(names);
  }, [names, onAnimationsLoaded]);

  useEffect(() => {
    if (currentAnimation && actions[currentAnimation]) {
      const prevAction = previousAnimation ? actions[previousAnimation] : null;
      const nextAction = actions[currentAnimation];

      if (prevAction) {
        prevAction.fadeOut(0.5);
      }
      nextAction.reset().fadeIn(0.5).play();
      setPreviousAnimation(currentAnimation);
    } else if (currentAnimation === null) {
      // Stop all animations when currentAnimation is null
      Object.values(actions).forEach((action) => action?.stop());
    }
  }, [actions, currentAnimation, previousAnimation]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ContactShadows opacity={0.4} scale={5} blur={2.4} />
      <group ref={group} dispose={null}>
        <primitive object={nodes.Scene} />
      </group>
    </>
  );
};

export default Model;
