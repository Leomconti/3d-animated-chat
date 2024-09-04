import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./Model";

const App: React.FC = () => {
  const [modelPath] = useState("/models/my_model.glb");
  const [animations, setAnimations] = useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimations = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnimations(["Idle", "Defeated", "Silly"]);
    };
    fetchAnimations();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <Model modelPath={modelPath} currentAnimation={currentAnimation} />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        {animations.map((anim) => (
          <button key={anim} onClick={() => setCurrentAnimation(anim)} style={{ marginRight: "10px" }}>
            Play {anim}
          </button>
        ))}
        <button onClick={() => setCurrentAnimation(null)}>Stop Animation</button>
      </div>
    </div>
  );
};

export default App;
