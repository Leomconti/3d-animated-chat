import React, { useState } from "react";

interface ChatProps {
  onAnimationChange: (animation: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onAnimationChange }) => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(input)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const aiMessage = { text: data.message, sender: "ai" as const };
      setMessages((prev) => [...prev, aiMessage]);
      onAnimationChange(data.animation_name);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container" style={{ width: "40%", padding: "20px" }}>
      <div
        className="messages"
        style={{ height: "400px", overflowY: "auto", marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px", textAlign: msg.sender === "user" ? "right" : "left" }}>
            <span
              style={{
                background: msg.sender === "user" ? "#007bff" : "#28a745",
                color: "white",
                padding: "5px 10px",
                borderRadius: "10px",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="input-area" style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          style={{ flexGrow: 1, marginRight: "10px", padding: "5px" }}
        />
        <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
