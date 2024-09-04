import React, { useState, useRef, useEffect } from "react";

interface ChatProps {
  onAnimationChange: (animation: string) => void;
  animations: string[];
}

const Chat: React.FC<ChatProps> = ({ onAnimationChange, animations }) => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(`http://localhost:8000/chat`, {
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
      const aiMessage = { text: data.message, sender: "ai" as const };
      setMessages((prev) => [...prev, aiMessage]);
      if (data.animation_name && animations.includes(data.animation_name)) {
        onAnimationChange(data.animation_name);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className="chat-container"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        pointerEvents: "auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="messages"
        style={{
          maxHeight: "70%",
          overflowY: "auto",
          marginBottom: "20px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          padding: "15px",
          backdropFilter: "blur(10px)",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                background: msg.sender === "user" ? "rgba(0, 123, 255, 0.7)" : "rgba(40, 167, 69, 0.7)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "15px",
                display: "inline-block",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area" style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flexGrow: 1,
            marginRight: "10px",
            padding: "10px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(0, 123, 255, 0.7)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
