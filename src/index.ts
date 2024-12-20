import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios, { Method, AxiosRequestConfig } from 'axios';
import logger from './logger';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './Router/userRoutes'; // Import user routes

const app = express();
const PORT: number = parseInt(process.env.Port || '8081', 10);

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Use userRoutes for /api/users paths
app.use('/api/users', userRoutes);

// Define the backend service endpoint for users
const usersService = 'http://localhost:4070/api/users';

// Proxy the request to the backend service (you can remove this if routes are fully handled in userRoutes.ts)
app.use('/api/users', async (req: Request, res: Response) => {
    try {
        const axiosConfig: AxiosRequestConfig = {
            method: req.method as Method,
            url: usersService + req.url,  // Append the requested URL to the target service
            data: req.body,
            headers: req.headers
        };

        const response = await axios(axiosConfig);
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error('Error while proxying request to /api/users:', error);
        res.status(500).json({ message: 'Error routing the request to the backend service' });
    }
});

// Start the API Gateway server
app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
});
