# AI Powered Support Assistant

A full-stack support chat application built with React, Node.js, and SQLite. The assistant answers user queries strictly based on the provided document using LLM integration and SQLite for session persistence. 

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js (Express)
- **Database:** SQLite
- **LLM:** LLM Integration for document based answering (OpenAI/Gemini)

## Project Structure
- `/frontend`: React application (UI, Chat Interface, Session Management)
- `/backend`: Express API (LLM Orchestration, SQLite Integration, Rate Limiting)

## Database Schema

### Table: `sessions`
|   column        |     type        |       notes                   |
|-----------------|-----------------|-------------------------------|
|   id            |     TEXT        |   Primary Key (sessionId)     |
|   created_at    |     DATETIME    |   session creation timestamp  |
|   updated_at    |     DATETIME    |   last activity timestamp     |

### Table: `messages`
|   column        |     type        |       notes                   |
|-----------------|-----------------|-------------------------------|
|   id            |     INTEGER     |   Primary Key (autoincrement) |
|   session_id    |     TEXT        |   Foreign Key to sessions     |
|   role          |     TEXT        |   "user" or "assistant"       |
|   content       |     TEXT        |   message text                |
|   created_at    |     DATETIME    |   message timestamp           |

## Core Features
- **Strict Document-Based QA:** Answers only using `docs.json`
- **Session Memory:** Remembers the last 5 message pairs using SQLite.
- **Persistent Chat:** Sessions are stored in the LocalStorage and synced with the Database.
- **Rate Limiting:** Basic IP-based protection for the API.

# Setup Instructions

## Prerequisites

### Make sure you have installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node)
- **Git**

### Check versions:

```bash
node -v
npm -v
git --version
```

## Clone the Repository
```bash
git clone https://github.com/MMALLIKARJUN2312/AI_Powered_Support_Assistant.git
cd AI_Powered_Support_Assistant
```

## Backend Setup (Node.js + Express + SQLite)

### Navigate to Backend

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

- **Copy .env.example to .env:**

```bash
cp .env.example .env
```

- **Edit .env and add your LLM API_KEY:**

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Database Setup

- SQLite database file (database.sqlite) is created automatically.
- sessions and messages will be created automatically.
- No manual setup is required.

### Start Backend Server

### Development Mode:

```bash
npm run dev
```

### Production Mode:

```bash
npm start   
```

Backend runs at: [http://localhost:5000](http://localhost:5000)

## Frontend Setup (React.js)

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Configure API Base URL (if backend port differs)

**Edit frontend/src/api.js** 

- export const API_BASE_URL = "http://localhost:5000"

### Start React App

### Development Mode:

```bash
npm run dev
```

### Production Mode:

```bash
npm run build
npm run preview   
```

Frontend runs at: [http://localhost:5173](http://localhost:5173)

# Document-Based Answering

## `docs.json`

Example:

```json
[
  {
    "title": "Reset Password",
    "content": "Users can reset password from Settings > Security."
  },
  {
    "title": "Refund Policy",
    "content": "Refunds are allowed within 7 days of purchase."
  }
]
```

## Strict AI Rules

The assistant:

* Uses ONLY information from `docs.json`
* Uses last 5 user+assistant pairs from SQLite as context
* Do NOT hallucinate
* DO NOT guess

If answer not found:

```
Sorry, I don’t have information about that.
```

# Prompt Construction Logic

The backend constructs a prompt using:

1. Relevant document content
2. Last 5 conversation pairs (from SQLite)
3. Current user question

Example structure:

```
You are a support assistant.
Only answer using the provided documentation.
If the answer is not found, say:
"Sorry, I don’t have information about that."

Documentation:
{relevant_docs}

Conversation History:
{last_5_pairs}

User Question:
{current_question}
```

# API Documentation

## 1. Chat Endpoint

### `POST /api/chat`

### Request:

```json
{
  "sessionId": "abc123",
  "message": "How can I reset my password?"
}
```

### Response:

```json
{
  "reply": "Users can reset password from Settings > Security.",
  "tokensUsed": 123
}
```

### Errors:

```json
{
  "error": "SessionId and message are required."
}
```

## 2. Fetch Conversation

### `GET /api/conversations/:sessionId`

Returns full conversation in chronological order.

### Response:

```json
[
  {
    "role": "user",
    "content": "How can I reset my password?",
    "created_at": "2026-02-24T10:00:00Z"
  },
  {
    "role": "assistant",
    "content": "Users can reset password from Settings > Security.",
    "created_at": "2026-02-24T10:00:02Z"
  }
]
```

## 3. List Sessions

### `GET /api/sessions`

### Response:

```json
[
  {
    "sessionId": "abc123",
    "lastUpdated": "2026-02-24T10:00:02Z"
  }
]
```

# Rate Limiting

Implemented using `express-rate-limit`.

* Limits requests per IP
* Prevents API abuse
* Returns:

```json
{
  "error": "Too many requests. Please try again later."
}
```