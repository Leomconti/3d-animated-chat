import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./Model";
import Chat from "./Chat";

const App: React.FC = () => {
  const [modelPath] = useState("/models/my_model.glb");
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  // const animations = ["Idle", "Defeated", "Silly"];

  const handleAnimationChange = (animation: string) => {
    setCurrentAnimation(animation);
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <div style={{ width: "60%", position: "relative" }}>
        <Canvas camera={{ position: [0, 1.5, 3] }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Suspense fallback={null}>
            <Model modelPath={modelPath} currentAnimation={currentAnimation} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
      <Chat onAnimationChange={handleAnimationChange} />
    </div>
  );
};

export default App;
