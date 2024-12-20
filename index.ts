import express from "express";
import http from "http";
import WebSocket from "ws";
import cors from "cors";
import dotenv from "dotenv";
import { initializeChatService } from "./service/chatServices";
import chatRouter from "./router/chatRouter"; // Import chatRouter

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Log the middleware usage for troubleshooting
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});

// Use the chat API routes
app.use("/api/chat", chatRouter); // Mount the router at /api/chat

// Initialize HTTP server (combining with WebSocket server)
const server = http.createServer(app);

// Initialize WebSocket server (sharing the same server instance)
const wss = new WebSocket.Server({ server });

// Initialize chat service to handle WebSocket connections
initializeChatService(wss);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
