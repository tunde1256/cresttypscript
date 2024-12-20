"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes")); // Correct relative path
const app = (0, express_1.default)();
const port = 4000;
// Middleware
app.use(body_parser_1.default.json()); // to parse JSON requests
// Use task routes
app.use('/api', taskRoutes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
