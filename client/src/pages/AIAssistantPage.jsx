// pages/AIAssistantPage.jsx
// Chat-style AI assistant — UI redesign only.
// All logic unchanged: askAI() API call, message state, auto-scroll,
// Enter-key send, loading state, resource chips.

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { askAI } from "../api/ai";

// Suggestion prompts shown on the empty state
const SUGGESTIONS = [
  "Find notes for Data Mining",
  "Show Compiler Design resources",
  "What is a binary search tree?",
  "3rd year CSE lab manuals",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const messagesEndRef           = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const data = await askAI(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply, resources: data.resources || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again.", resources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content" style={{ display: "flex", flexDirection: "column" }}>

        {/* ── Navy page header ─────────────────────────────── */}
        <div className="ai-page-header">
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div className="ai-page-title-icon">✦</div>
            <div>
              <div className="ai-page-title">EduNest AI Assistant</div>
              <div className="ai-page-subtitle">
                Ask academic questions or search the resource repository using natural language.
              </div>
            </div>
          </div>
        </div>

        {/* ── Chat area ────────────────────────────────────── */}
        <div className="page-wrapper" style={{ flex: 1, paddingTop: "0", paddingBottom: "8px", display: "flex", flexDirection: "column" }}>
          <div className="ai-chat-container">

            {/* Messages */}
            <div className="ai-chat-messages">

              {/* Empty / welcome state */}
              {messages.length === 0 && (
                <div className="ai-welcome">
                  <div className="ai-welcome-icon">✦</div>
                  <h2>Hi, I&apos;m EduNest AI</h2>
                  <p>
                    Ask me anything academic — I can find notes, question papers,
                    lab manuals, and more, or answer general study questions.
                  </p>

                  {/* Suggestion chips */}
                  <div className="ai-suggestion-row">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        className="ai-suggestion"
                        onClick={() => handleSend(s)}
                        disabled={loading}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message list */}
              {messages.map((msg, idx) => (
                <div key={idx} className={`ai-message ${msg.role}`}>
                  <span className="ai-message-label">
                    {msg.role === "user" ? "You" : "EduNest AI"}
                  </span>
                  <div className="ai-message-bubble">{msg.text}</div>

                  {/* Resource chips under assistant messages */}
                  {msg.role === "assistant" && msg.resources?.length > 0 && (
                    <div className="ai-resource-chips">
                      <span className="ai-resource-chip-label">Related resources:</span>
                      {msg.resources.map((r) => (
                        <span key={r._id} className="ai-resource-chip">{r.title}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading bubble */}
              {loading && (
                <div className="ai-message assistant">
                  <span className="ai-message-label">EduNest AI</span>
                  <div className="ai-message-bubble" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)" }}>
                    <div className="spinner" style={{ borderTopColor: "var(--accent)" }} />
                    <span style={{ fontSize: "0.85rem" }}>Thinking…</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="ai-chat-input-area">
              <input
                type="text"
                className="form-input"
                placeholder="Ask a question about your academic resources…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button
                className="btn-accent"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                style={{ flexShrink: 0 }}
              >
                Send ↑
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
