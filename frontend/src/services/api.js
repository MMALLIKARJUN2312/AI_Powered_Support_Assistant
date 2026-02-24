// Centralized API communication

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const sendMessage = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

export const fetchConversation = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/conversations/${sessionId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch conversation");
  }

  return response.json();
};