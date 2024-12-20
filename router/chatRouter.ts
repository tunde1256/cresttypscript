import { Router, Request, Response } from "express";
import db from "../db/db";

// Define interface for message request body
interface MessageRequestBody {
  username: string;
  text: string;
  type: "public" | "dm";
  recipient?: string;
}

// Create the router
const router = Router();

// Route for getting all chat messages
router.get("/messages", async (req: Request, res: Response): Promise<any> => {
  try {
    const messages = await db("chat_messages").select("username", "text", "created_at", "type", "recipient");
    return res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Route for sending a new chat message
router.post("/send", async (req: Request<{}, {}, MessageRequestBody>, res: Response): Promise<any> => {
  const { username, text, type, recipient } = req.body;

  // Validate request data
  if (!username || !text || !type) {
    return res.status(400).json({ error: "Invalid message format" });
  }

  try {
    await db("chat_messages").insert({
      username,
      text,
      type,
      recipient: recipient || null,
    });

    // Respond with success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
