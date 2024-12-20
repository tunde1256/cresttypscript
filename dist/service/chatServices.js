"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeChatService = void 0;
const ws_1 = require("ws"); // Correctly import WebSocketServer and WebSocket
const knex_1 = __importDefault(require("../config/knex")); // Import the Knex instance
const initializeChatService = (wss) => {
    const users = {}; // Store users by their usernames or IDs
    wss.on("connection", (ws, req) => {
        console.log("User connected");
        // Get the IP address from the connection's request or assign a random username for testing
        const username = req.connection.remoteAddress || `User-${Math.floor(Math.random() * 1000)}`;
        users[username] = ws; // Store user WebSocket in the users map
        // Send chat history to the newly connected user
        (0, knex_1.default)("chat_messages")
            .select("username", "text", "created_at", "type", "recipient")
            .then((messages) => {
            // Send all chat history to the newly connected user
            const plainMessages = messages.map(msg => ({
                username: msg.username,
                text: msg.text,
                created_at: msg.created_at,
                type: msg.type,
                recipient: msg.recipient,
            }));
            ws.send(JSON.stringify(plainMessages)); // Send chat history to the user
        })
            .catch((err) => {
            console.error("Error fetching chat history:", err);
        });
        // Handle incoming messages
        ws.on("message", (message) => {
            console.log("Message received:", message);
            try {
                const parsedMessage = JSON.parse(message);
                if (typeof parsedMessage.text === "string" && typeof parsedMessage.type === "string") {
                    const { text, type, recipient } = parsedMessage;
                    // Insert the message into the database
                    (0, knex_1.default)("chat_messages")
                        .insert({
                        username: username, // Use the username for the sender
                        text: text, // Store as plain text
                        type: type, // 'public' for forum messages, 'dm' for direct messages
                        recipient: recipient || null, // If type is 'dm', include the recipient
                    })
                        .then(() => {
                        // Broadcast the message
                        if (type === "public") {
                            // Broadcast to all clients (forum)
                            wss.clients.forEach((client) => {
                                if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                                    client.send(JSON.stringify({
                                        username,
                                        text,
                                        type,
                                        recipient: null,
                                    }));
                                }
                            });
                        }
                        else if (type === "dm" && recipient) {
                            // Send direct message to the recipient only
                            const recipientSocket = users[recipient];
                            if (recipientSocket && recipientSocket.readyState === ws_1.WebSocket.OPEN) {
                                recipientSocket.send(JSON.stringify({
                                    username,
                                    text,
                                    type,
                                    recipient,
                                }));
                            }
                            else {
                                console.error(`Recipient ${recipient} not connected`);
                            }
                        }
                    })
                        .catch((error) => {
                        console.error("Error saving message:", error);
                    });
                }
                else {
                    console.error("Received message has invalid structure:", parsedMessage);
                }
            }
            catch (error) {
                console.error("Error parsing message:", error);
            }
        });
        // Handle disconnections
        ws.on("close", () => {
            console.log(`${username} disconnected`);
            delete users[username]; // Remove the user from the map on disconnect
        });
    });
};
exports.initializeChatService = initializeChatService;
