import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios, { Method, AxiosRequestConfig } from 'axios';  // Import Method type
import logger from './logger'; // Assuming you have a logger setup
import cors from 'cors';
import morgan from 'morgan';

const app = express();

// Get the port from environment variables or default to 8080
const PORT: number = parseInt(process.env.GATEWAY_PORT || '8080', 10);

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Define the backend service endpoint for users
const usersService = 'http://localhost:4070/api/users'; // Backend service for /api/users

// Define the route for proxying requests to the /api/users endpoint
app.use('/api/users', async (req: Request, res: Response) => {
    try {
        // Forward the request to the backend (Express app)
        const axiosConfig: AxiosRequestConfig = {
            method: req.method as Method,  // Ensure method is correctly typed
            url: usersService,            // The backend service to forward the request to
            data: req.body,               // Forward the request body (if any)
            headers: req.headers          // Forward the headers (if needed)
        };

        const response = await axios(axiosConfig);  // Send the request to the backend service

        // Send the response from the backend service to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        // Log and handle any errors that occur while proxying the request
        logger.error('Error while proxying request to /api/users:', error);
        res.status(500).json({ message: 'Error routing the request to the backend service' });
    }
});

// Start the API Gateway server
app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
});
