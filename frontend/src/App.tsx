import { Canvas } from "@react-three/fiber";
import DraggableChat from "./DraggableChat";
import Scene from "./Scene";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows>
        <Scene />
      </Canvas>
      <DraggableChat />
    </div>
  );
}
