import { Request, Response } from 'express';
import { TaskModel } from '../model/taskModel';
import UserService from '../../../usermanagement/src/model/userModel';

export class TaskController {
  // Create a new task
  static async createTask(req: Request, res: Response): Promise<any> {
    const { title, description, userId } = req.body;

    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newTask = await TaskModel.createTask(title, description, userId);
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating task', error });
    }
  }

  // Get all tasks
  static async getAllTasks(req: Request, res: Response): Promise<any> {
    try {
      const tasks = await TaskModel.getAllTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching tasks', error });
    }
  }

  // Get a single task by ID
  static async getTaskById(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const task = await TaskModel.getTaskById(Number(id));
      if (task) {
        return res.status(200).json(task);
      } else {
        return res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching task', error });
    }
  }

  // Update a task
  static async updateTask(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const updates = req.body;
    try {
      const updatedTask = await TaskModel.updateTask(Number(id), updates);
      if (updatedTask) {
        return res.status(200).json(updatedTask);
      } else {
        return res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error updating task', error });
    }
  }

  // Delete a task
  static async deleteTask(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    try {
      const deletedCount = await TaskModel.deleteTask(Number(id));
      if (deletedCount) {
        return res.status(200).json({ message: 'Task deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting task', error });
    }
  }
}
