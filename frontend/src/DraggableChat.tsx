import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface Message {
  text: string;
  sender: "user" | "ai";
}

export default function DraggableChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(({ offset: [ox, oy] }) => {
    api.start({ x: ox, y: oy, immediate: true });
  });

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "I'm an AI response!", sender: "ai" }]);
      }, 1000);
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
