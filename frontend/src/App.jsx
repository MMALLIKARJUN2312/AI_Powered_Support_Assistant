import { useEffect, useState } from "react";
import { sendMessage, fetchConversation } from "./services/api";
import { getOrCreateSessionId, createNewSession } from "./utils/session";
import "./index.css";

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
    
    <div className="chat-header">
      <h2>AI Support Assistant</h2>
      <button className="new-chat-btn" onClick={handleNewChat}>
        New Chat
      </button>
    </div>

    <div className="messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
          <div>{msg.content}</div>
          <small>
            {new Date(msg.created_at).toLocaleTimeString()}
          </small>
        </div>
      ))}
    </div>

    {loading && <p>Generating response...</p>}

    <div className="input-container">
      <input
        type="text"
        value={input}
        disabled={loading}
        placeholder="Type your question..."
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>

  </div>
);
}

export default App;