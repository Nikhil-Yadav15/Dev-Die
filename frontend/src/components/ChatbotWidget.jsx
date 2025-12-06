import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ChatbotWidget({ userId, open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  if (!open) return null;

  const sendMessage = async () => {
    if (!input.trim() || !userId) return;
    const userMessage = { user: true, text: input.trim() };
    const typingMessage = { user: false, text: "AI is typing..." };

    setMessages(msgs => [...msgs, userMessage, typingMessage]);
    setLoading(true);
    setInput('');
    const typingIndex = messages.length + 1;

    try {
      const res = await axios.post("https://medico-backend-hjxm.onrender.com/chatbot", {
        message: input.trim(),
        userId
      });

      const aiReply = res.data?.reply || "No reply received.";
      setMessages(msgs => msgs.map((msg, i) => i === typingIndex ? { ...msg, text: aiReply } : msg));
    } catch (err) {
      setMessages(msgs => msgs.map((msg, i) => i === typingIndex ? { ...msg, text: "Error: Unable to get reply." } : msg));
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 1000,
      boxShadow: '0px 2px 12px rgba(0,0,0,0.2)',
      borderRadius: 12,
      border: '1px solid #333',
      width: 380,
      height: 440,
      background: '#111',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 8,
          right: 14,
          color: "#fff",
          background: "none",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
        }}
      >×</button>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#222',
        padding: "20px 16px",
        borderRadius: 12
      }}>
        {messages.map((m, i) => (
          <div key={i}
            style={{
              textAlign: m.user ? "right" : "left",
              margin: "8px 0",
              background: m.user ? "#444" : "#333",
              color: "#fff",
              padding: "9px 14px",
              borderRadius: 10,
              display: "inline-block",
              maxWidth: "80%"
            }}>
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{
        display: "flex",
        gap: 6,
        padding: "12px 14px",
        background: "#111",
        borderTop: "1px solid #282828"
      }}>
        <input
          placeholder="Ask a health question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 6,
            border: "1px solid #444",
            background: "#222",
            color: "#fff"
          }}
          disabled={loading || !userId}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !userId}
          style={{
            padding: "8px 18px",
            borderRadius: 4,
            cursor: "pointer",
            background: "#444",
            color: "#fff",
            border: "1px solid #555"
          }}
        >{loading ? "..." : "Send"}</button>
      </div>
      {!userId && <div style={{ color: "#bbb", fontSize: 13, margin: 8 }}>User not logged in.</div>}
    </div>
  );
}
