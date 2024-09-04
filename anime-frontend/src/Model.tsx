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
    console.log("Available animations:", names);
    console.log("Animation objects:", animations);
    console.log("Available actions:", Object.keys(actions));
  }, [animations, actions, names]);

  useEffect(() => {
    if (currentAnimation) {
      console.log(`Attempting to play animation: ${currentAnimation}`);
      if (actions[currentAnimation]) {
        console.log(`Playing animation: ${currentAnimation}`);
        actions[currentAnimation].reset().fadeIn(0.5).play();
        return () => {
          actions[currentAnimation]?.fadeOut(0.5);
        };
      } else {
        console.warn(`Animation "${currentAnimation}" not found in actions.`);
      }
    }
  }, [actions, currentAnimation]);

  useFrame(() => {
    Object.values(actions).forEach((action) => {
      if (action?.isRunning?.()) {
        console.log(`Animation running: ${action.getClip().name}, time: ${action.time}`);
      }
    });
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Scene} />
    </group>
  );
};

export default Model;
