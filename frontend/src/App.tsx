import React, { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import Model from "./Model";
import Car from "./Car";
import Chat from "./Chat";
import { ErrorBoundary } from "react-error-boundary";

const FallbackComponent: React.FC<{ error: Error }> = ({ error }) => (
  <Text
    position={[0, 1, 0]}
    color="red"
    fontSize={0.5}
    maxWidth={200}
    lineHeight={1}
    letterSpacing={0.02}
    textAlign="center"
    anchorX="center"
    anchorY="middle"
  >
    {`Error: ${error.message}`}
  </Text>
);

const App: React.FC = () => {
  const [modelPath] = useState("/models/my_model.glb");
  const [currentAnimation, setCurrentAnimation] = useState<string | null>("Idle");
  const [animations, setAnimations] = useState<string[]>([]);

  const handleAnimationChange = (animation: string | null) => {
    setCurrentAnimation(animation);
  };

  const handleAnimationsLoaded = useCallback((loadedAnimations: string[]) => {
    setAnimations(loadedAnimations);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows style={{ background: "linear-gradient(to bottom, #1a2a6c, #b21f1f, #fdbb2d)" }}>
        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={60} />
        <fog attach="fog" args={["#1a2a6c", 5, 15]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow intensity={2} />
        <Suspense fallback={null}>
          <ErrorBoundary FallbackComponent={FallbackComponent}>
            <Model
              modelPath={modelPath}
              currentAnimation={currentAnimation}
              onAnimationsLoaded={handleAnimationsLoaded}
            />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={FallbackComponent}>
            <Car />
          </ErrorBoundary>
        </Suspense>
        <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>
        <Text
          position={[-2, 2, -5]}
          color="white"
          fontSize={0.5}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="left"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="left"
          anchorY="top"
        >
          Welcome to the 3D Chat Experience!
        </Text>
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "20%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: "20px",
          overflowY: "auto",
          boxSizing: "border-box",
          maxHeight: "100vh",
        }}
      >
        <h3>Animation Controls</h3>
        {animations.map((anim) => (
          <button
            key={anim}
            onClick={() => handleAnimationChange(anim)}
            style={{
              display: "block",
              margin: "5px 0",
              padding: "5px 10px",
              background: currentAnimation === anim ? "rgba(0, 123, 255, 0.7)" : "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            {anim}
          </button>
        ))}
        <button
          onClick={() => handleAnimationChange(null)}
          style={{
            display: "block",
            margin: "5px 0",
            padding: "5px 10px",
            background: "rgba(255, 0, 0, 0.7)",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          Stop All Animations
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "30%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <Chat onAnimationChange={handleAnimationChange} animations={animations} />
      </div>
    </div>
  );
};

export default App;
