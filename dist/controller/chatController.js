"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketConnection = void 0;
const knex_1 = __importDefault(require("../config/knex")); // Import the Knex instance
// Handle incoming socket connections and messages
const handleSocketConnection = (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Send chat history when a user connects
    (0, knex_1.default)("chat_messages")
        .select("username", "text", "created_at")
        .then((messages) => {
        socket.emit("receiveMessage", messages); // Send chat history to the newly connected user
    })
        .catch((err) => {
        console.error("Error fetching chat history:", err);
    });
    // Handle incoming messages
    socket.on("sendMessage", (message) => {
        console.log("Message received:", message);
        // Insert message into the database
        (0, knex_1.default)("chat_messages")
            .insert({
            username: socket.id, // Or use the actual username if available
            text: message,
        })
            .then(() => {
            socket.broadcast.emit("receiveMessage", message); // Broadcast message to all users
        })
            .catch((error) => {
            console.error("Error saving message:", error);
        });
    });
    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
};
exports.handleSocketConnection = handleSocketConnection;
