import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Environment from "./Environment";
import Character from "./Character";

export default function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} />
      <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
      <Environment />
      <Character modelPath="/models/my_model.glb" />
    </>
  );
}
