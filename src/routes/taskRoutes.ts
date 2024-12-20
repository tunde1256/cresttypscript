import express from 'express';
import { TaskController } from '../controller/Taskcontroller';

const router = express.Router();

// Routes for task management
router.post('/tasks', TaskController.createTask);
router.get('/tasks', TaskController.getAllTasks);
router.get('/tasks/:id', TaskController.getTaskById);
router.put('/tasks/:id', TaskController.updateTask);
router.delete('/tasks/:id', TaskController.deleteTask);

export default router;
