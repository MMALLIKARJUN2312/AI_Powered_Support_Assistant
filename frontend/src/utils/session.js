// Handle sessionId generation and storage

export const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

export const createNewSession = () => {
  const newId = crypto.randomUUID();
  localStorage.setItem("sessionId", newId);
  return newId;
};