"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Taskcontroller_1 = require("../controller/Taskcontroller");
const router = express_1.default.Router();
// Routes for task management
router.post('/tasks', Taskcontroller_1.TaskController.createTask);
router.get('/tasks', Taskcontroller_1.TaskController.getAllTasks);
router.get('/tasks/:id', Taskcontroller_1.TaskController.getTaskById);
router.put('/tasks/:id', Taskcontroller_1.TaskController.updateTask);
router.delete('/tasks/:id', Taskcontroller_1.TaskController.deleteTask);
exports.default = router;
