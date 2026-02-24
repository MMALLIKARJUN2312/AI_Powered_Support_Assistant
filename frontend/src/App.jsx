import { useEffect, useState } from "react";
import { sendMessage, fetchConversation } from "./services/api";
import { getOrCreateSessionId, createNewSession } from "./utils/session";
import "./styles/chat.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  const sessionId = getOrCreateSessionId();

  // Load previous conversation
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const data = await fetchConversation(sessionId);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadConversation();
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    setError(null);

    const userMessage = {
      role: "user",
      content: input,
      created_at: new Date().toISOString()
    };

    setMessages(previous => [...previous, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage({
        sessionId,
        message: userMessage.content
      });

      const assistantMessage = {
        role: "assistant",
        content: response.reply,
        created_at: new Date().toISOString()
      };

      setMessages(previous => [...previous, assistantMessage]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    createNewSession();
    window.location.reload();
  };

  return (
    <div className="chat-container">
      <h2>AI Support Assistant</h2>

      <button onClick={handleNewChat}>New Chat</button>

      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
          <div>{msg.content}</div>
          <small>{new Date(msg.created_at).toLocaleString()}</small>
        </div>
      ))}

      {loading && <p>Generating response...</p>}

      <div className="input-container">
        <input
          type="text"
          value={input}
          disabled={loading}
          placeholder="Type your question..."
          onChange={(event) => setInput(event.target.value)}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;