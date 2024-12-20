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
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("./logger"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = __importDefault(require("./Router/userRoutes")); // Import user routes
const app = (0, express_1.default)();
const PORT = parseInt(process.env.Port || '8081', 10);
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
// Use userRoutes for /api/users paths
app.use('/api/users', userRoutes_1.default);
// Define the backend service endpoint for users
const usersService = 'http://localhost:4070/api/users';
// Proxy the request to the backend service (you can remove this if routes are fully handled in userRoutes.ts)
app.use('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const axiosConfig = {
            method: req.method,
            url: usersService + req.url, // Append the requested URL to the target service
            data: req.body,
            headers: req.headers
        };
        const response = yield (0, axios_1.default)(axiosConfig);
        res.status(response.status).json(response.data);
    }
    catch (error) {
        logger_1.default.error('Error while proxying request to /api/users:', error);
        res.status(500).json({ message: 'Error routing the request to the backend service' });
    }
}));
// Start the API Gateway server
app.listen(PORT, () => {
    logger_1.default.info(`API Gateway is running on port ${PORT}`);
});
