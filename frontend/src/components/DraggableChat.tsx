import { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface Message {
  text: string;
  sender: "user" | "ai";
}

interface DraggableChatProps {
  onAnimationChange: (animation: string | null) => void;
  animations: string[];
}

export default function DraggableChat({ onAnimationChange, animations }: DraggableChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(({ offset: [ox, oy] }) => {
    api.start({ x: ox, y: oy, immediate: true });
  });

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setInput("");

      try {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
            animations: animations,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessages((prev) => [...prev, { text: data.message, sender: "ai" }]);

        if (data.animation_name && animations.includes(data.animation_name)) {
          onAnimationChange(data.animation_name);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [...prev, { text: "Error: Could not get a response.", sender: "ai" }]);
      }
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        position: "absolute",
        top: 20,
        right: 20,
        width: 300,
        height: 400,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 10,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        touchAction: "none",
      }}
    >
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 10, textAlign: msg.sender === "user" ? "right" : "left" }}>
            <span
              style={{
                background: msg.sender === "user" ? "#4CAF50" : "#2196F3",
                color: "white",
                padding: "5px 10px",
                borderRadius: 20,
                display: "inline-block",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, marginRight: 10, padding: 5, borderRadius: 5, border: "none" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "5px 10px", borderRadius: 5, border: "none", background: "#4CAF50", color: "white" }}
        >
          Send
        </button>
      </div>
    </animated.div>
  );
}
