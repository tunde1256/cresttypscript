import db from '../db/db'; // Adjust the path based on the actual location of the `db` module


// Task model for creating, retrieving, updating, and deleting tasks
export class TaskModel {
  // Create a new task with userId
  static async createTask(title: string, description: string, userId: number) {
    const [newTask] = await db('tasks').insert({
      title,
      description,
      completed: false,
      user_id: userId,  // Add the userId to associate the task with a user
    }).returning('*');
    return newTask;
  }

  // Get all tasks (optionally, you can join with users here)
  static async getAllTasks() {
    return db('tasks').select('*');
  }

  // Get a task by ID
  static async getTaskById(id: number) {
    return db('tasks').where({ id }).first();
  }

  // Update a task
  static async updateTask(id: number, updates: { title?: string, description?: string, completed?: boolean }) {
    const [updatedTask] = await db('tasks').where({ id }).update(updates).returning('*');
    return updatedTask;
  }

  // Delete a task
  static async deleteTask(id: number) {
    return db('tasks').where({ id }).del();
  }
}
