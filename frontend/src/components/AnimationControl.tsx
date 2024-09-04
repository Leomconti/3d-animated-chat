interface AnimationControlsProps {
  animations: string[];
  currentAnimation: string | null;
  onAnimationChange: (animation: string | null) => void;
}

export default function AnimationControls({ animations, currentAnimation, onAnimationChange }: AnimationControlsProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "rgba(0, 0, 0, 0.7)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      {animations.map((anim) => (
        <button
          key={anim}
          onClick={() => onAnimationChange(anim)}
          style={{
            padding: "5px 10px",
            background: currentAnimation === anim ? "#4CAF50" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {anim}
        </button>
      ))}
      <button
        onClick={() => onAnimationChange(null)}
        style={{
          padding: "5px 10px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Stop Animation
      </button>
    </div>
  );
}
