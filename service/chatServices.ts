import { WebSocketServer, WebSocket } from "ws";
import db from "../config/knex"; // Import Knex instance for database interaction

interface Message {
  username: string;
  text: string;
  created_at: Date;
  type: "public" | "dm"; // 'public' for forum, 'dm' for direct messages
  recipient?: string; // Optional field for DM recipient
}

// Initialize the chat service
export const initializeChatService = (wss: WebSocketServer): void => {
  // Store connected users with their WebSocket and username
  const users: Record<string, { ws: WebSocket; username: string }> = {};

  wss.on("connection", (ws: WebSocket, req: any) => {
    console.log("New user connected");
    let username = "";

    // Handle messages from clients
    ws.on("message", async (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);

        // If username is not set, the first message must contain the username
        if (!username && parsedMessage.username) {
          username = parsedMessage.username;
          users[username] = { ws, username }; // Save the user to the connected users map
          console.log(`${username} has joined the chat`);
          return;
        }

        // Extract message details
        const { text, type, recipient } = parsedMessage;

        if (!text || !type) {
          console.error("Invalid message format");
          return;
        }

        // Insert the message into the database
        await db("chat_messages").insert({
          username,
          text,
          type,
          recipient: recipient || null,
        });

        // Broadcast public messages to all connected users
        if (type === "public") {
          wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  username,
                  text,
                  type,
                  recipient: null,
                })
              );
            }
          });
        }

        // Send direct messages to the recipient only
        if (type === "dm" && recipient) {
          const recipientUser = users[recipient];
          if (recipientUser && recipientUser.ws.readyState === WebSocket.OPEN) {
            recipientUser.ws.send(
              JSON.stringify({
                username,
                text,
                type,
                recipient,
              })
            );
          } else {
            console.error(`Recipient ${recipient} is not connected`);
          }
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    // Handle client disconnection
    ws.on("close", () => {
      console.log(`${username} disconnected`);
      delete users[username]; // Remove user from the map
    });
  });
};
