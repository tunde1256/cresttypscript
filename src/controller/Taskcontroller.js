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
exports.TaskController = void 0;
const taskModel_1 = require("../model/taskModel");
const userModel_1 = __importDefault(require("../../../usermanagement/src/model/userModel"));
class TaskController {
    // Create a new task
    static createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, userId } = req.body;
            try {
                const user = yield userModel_1.default.getUserById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const newTask = yield taskModel_1.TaskModel.createTask(title, description, userId);
                return res.status(201).json(newTask);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error creating task', error });
            }
        });
    }
    // Get all tasks
    static getAllTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield taskModel_1.TaskModel.getAllTasks();
                return res.status(200).json(tasks);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error fetching tasks', error });
            }
        });
    }
    // Get a single task by ID
    static getTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const task = yield taskModel_1.TaskModel.getTaskById(Number(id));
                if (task) {
                    return res.status(200).json(task);
                }
                else {
                    return res.status(404).json({ message: 'Task not found' });
                }
            }
            catch (error) {
                return res.status(500).json({ message: 'Error fetching task', error });
            }
        });
    }
    // Update a task
    static updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updates = req.body;
            try {
                const updatedTask = yield taskModel_1.TaskModel.updateTask(Number(id), updates);
                if (updatedTask) {
                    return res.status(200).json(updatedTask);
                }
                else {
                    return res.status(404).json({ message: 'Task not found' });
                }
            }
            catch (error) {
                return res.status(500).json({ message: 'Error updating task', error });
            }
        });
    }
    // Delete a task
    static deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deletedCount = yield taskModel_1.TaskModel.deleteTask(Number(id));
                if (deletedCount) {
                    return res.status(200).json({ message: 'Task deleted successfully' });
                }
                else {
                    return res.status(404).json({ message: 'Task not found' });
                }
            }
            catch (error) {
                return res.status(500).json({ message: 'Error deleting task', error });
            }
        });
    }
}
exports.TaskController = TaskController;
