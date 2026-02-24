import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildPrompt } from "../services/promptBuilder.js";
import { generateResponse } from "../services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsPath = path.join(__dirname, "../data/docs.json");
const docsData = JSON.parse(fs.readFileSync(docsPath, "utf-8"));

export const chatHandler = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // Validate request
    if (!sessionId || !message) {
      return res.status(400).json({
        error: "sessionId and message are required"
      });
    }

    // Ensure session exists
    db.run(
      `INSERT OR IGNORE INTO sessions (id) VALUES (?)`,
      [sessionId]
    );

    // Store user message
    db.run(
      `INSERT INTO messages (session_id, role, content)
       VALUES (?, ?, ?)`,
      [sessionId, "user", message]
    );

    // Retrieve last 10 messages (5 pairs)
    db.all(
      `SELECT role, content
       FROM messages
       WHERE session_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [sessionId],
      async (err, rows) => {
        if (err) {
          return res.status(500).json({
            error: "Database fetch error"
          });
        }

        // Reverse to chronological order
        const history = rows
          .reverse()
          .map(row => `${row.role}: ${row.content}`)
          .join("\n");

        // Prepare documentation text
        const docsText = docsData
          .map(doc => `${doc.title}: ${doc.content}`)
          .join("\n");

        // Build strict prompt
        const prompt = buildPrompt({
          docs: docsText,
          history,
          userMessage: message
        });

        let aiReply;

        try {
          aiReply = await generateResponse(prompt);
        } catch (error) {
          return res.status(500).json({
            error: "LLM service failure"
          });
        }

        // Strict validation enforcement
        const isValidAnswer = docsData.some(d =>
          aiReply.includes(d.content)
        );

        if (!isValidAnswer) {
          aiReply = "Sorry, I don’t have information about that.";
        }

        // Store assistant reply
        db.run(
          `INSERT INTO messages (session_id, role, content)
           VALUES (?, ?, ?)`,
          [sessionId, "assistant", aiReply]
        );

        // Return response
        return res.json({
          reply: aiReply,
          tokensUsed: aiReply.length
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};