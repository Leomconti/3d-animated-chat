import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, Environment as DreiEnvironment } from "@react-three/drei";
import * as THREE from "three";

export default function Environment() {
  const gridRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (-state.clock.elapsedTime * 0.2) % 1;
    }
  });

  return (
    <>
      <DreiEnvironment preset="sunset" />
      <Grid
        ref={gridRef}
        args={[10.5, 10.5]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
    </>
  );
}
