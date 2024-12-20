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
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const mutter_1 = __importDefault(require("../config/mutter")); // Multer + Cloudinary configuration
const router = express_1.default.Router();
// Register a new user
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const response = yield userController_1.default.register(user);
    res.status(response.success ? 200 : 400).json(response);
}));
// Login a user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const response = yield userController_1.default.login(email, password);
    res.status(response.success ? 200 : 400).json(response);
}));
// Update a user's details
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    const updates = req.body; // Fields to update
    const response = yield userController_1.default.updateUser(userId, updates);
    res.status(response.success ? 200 : 400).json(response);
}));
// Delete a user
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    const response = yield userController_1.default.deleteUser(userId);
    res.status(response.success ? 200 : 400).json(response);
}));
router.post('/:id/profile-picture', mutter_1.default.single('profile_picture'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    const file = req.file;
    // Check if a file is uploaded
    if (!file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded',
        });
    }
    try {
        // Call the controller method to handle the file upload and user update
        const response = yield userController_1.default.uploadProfilePicture(userId, file);
        res.status(response.success ? 200 : 400).json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error while uploading profile picture',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
// Logout a user
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Call the logout controller method
        const response = yield userController_1.default.logout(req, res);
        // Send the response without returning it
        res.status(response ? 200 : 400).json(response);
    }
    catch (error) {
        // Error handling
        res.status(500).json({
            success: false,
            message: 'Error during logout',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
// Get all users with pagination
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield userController_1.default.getAllUsers(req, res);
    res.status(response ? 200 : 400).json(response);
}));
exports.default = router;
