"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios")); // Import Method type
const logger_1 = __importDefault(require("./logger")); // Assuming you have a logger setup
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
// Get the port from environment variables or default to 8080
const PORT = parseInt(process.env.GATEWAY_PORT || '8080', 10);
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
// Define the backend service endpoint for users
const usersService = 'http://localhost:4070/api/users'; // Backend service for /api/users
// Define the route for proxying requests to the /api/users endpoint
app.use('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Forward the request to the backend (Express app)
        const axiosConfig = {
            method: req.method, // Ensure method is correctly typed
            url: usersService, // The backend service to forward the request to
            data: req.body, // Forward the request body (if any)
            headers: req.headers // Forward the headers (if needed)
        };
        const response = yield (0, axios_1.default)(axiosConfig); // Send the request to the backend service
        // Send the response from the backend service to the client
        res.status(response.status).json(response.data);
    }
    catch (error) {
        // Log and handle any errors that occur while proxying the request
        logger_1.default.error('Error while proxying request to /api/users:', error);
        res.status(500).json({ message: 'Error routing the request to the backend service' });
    }
}));
// Start the API Gateway server
app.listen(PORT, () => {
    logger_1.default.info(`API Gateway is running on port ${PORT}`);
});
//# sourceMappingURL=gateway.js.map