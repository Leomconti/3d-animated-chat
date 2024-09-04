import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import DraggableChat from "./components/DraggableChat";
import AnimationControls from "./components/AnimationControl";

export default function App() {
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [animations, setAnimations] = useState<string[]>([]);

  const handleAnimationChange = useCallback((animation: string | null) => {
    setCurrentAnimation(animation);
  }, []);

  const handleAnimationsLoaded = useCallback((loadedAnimations: string[]) => {
    setAnimations(loadedAnimations);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows>
        <Scene currentAnimation={currentAnimation} onAnimationsLoaded={handleAnimationsLoaded} />
      </Canvas>
      <DraggableChat onAnimationChange={handleAnimationChange} animations={animations} />
      <AnimationControls
        animations={animations}
        currentAnimation={currentAnimation}
        onAnimationChange={handleAnimationChange}
      />
    </div>
  );
}
