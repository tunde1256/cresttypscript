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
exports.TaskModel = void 0;
const db_1 = __importDefault(require("../db/db")); // Adjust the path based on the actual location of the `db` module
// Task model for creating, retrieving, updating, and deleting tasks
class TaskModel {
    // Create a new task with userId
    static createTask(title, description, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newTask] = yield (0, db_1.default)('tasks').insert({
                title,
                description,
                completed: false,
                user_id: userId, // Add the userId to associate the task with a user
            }).returning('*');
            return newTask;
        });
    }
    // Get all tasks (optionally, you can join with users here)
    static getAllTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, db_1.default)('tasks').select('*');
        });
    }
    // Get a task by ID
    static getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, db_1.default)('tasks').where({ id }).first();
        });
    }
    // Update a task
    static updateTask(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedTask] = yield (0, db_1.default)('tasks').where({ id }).update(updates).returning('*');
            return updatedTask;
        });
    }
    // Delete a task
    static deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, db_1.default)('tasks').where({ id }).del();
        });
    }
}
exports.TaskModel = TaskModel;
