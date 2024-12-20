import express from 'express';
import bodyParser from 'body-parser';
import taskRoutes from './routes/taskRoutes'; // Correct relative path


const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());  // to parse JSON requests

// Use task routes
app.use('/api', taskRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
