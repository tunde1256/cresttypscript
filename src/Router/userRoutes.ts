import express, { Request, Response } from 'express';
import UserController from '../controller/userController';
import upload from '../config/mutter'; // Multer + Cloudinary configuration
import  checkAuth  from '../config/checkauth'; // Assuming this is the authentication middleware

// Define the interfaces for better type checking
interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  full_name: string;
  gender: string;
  profile_picture?: string; // Profile picture field
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User; // User type for the authenticated user
    }
  }
}

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const user: User = req.body;
  const response = await UserController.register(user);
  res.status(response.success ? 200 : 400).json(response);
});

// Login a user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const response = await UserController.login(email, password);
  res.status(response.success ? 200 : 400).json(response);
});

// Update a user's details
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  const updates = req.body; // Fields to update
  const response = await UserController.updateUser(userId, updates);
  res.status(response.success ? 200 : 400).json(response);
});

// Delete a user
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  const response = await UserController.deleteUser(userId);
  res.status(response.success ? 200 : 400).json(response);
});


router.post('/:id/profile-picture', upload.single('profile_picture'), async (req: Request, res: Response): Promise<any> => {
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
      const response = await UserController.uploadProfilePicture(userId, file);
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error while uploading profile picture',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
  
// Logout a user
router.post('/logout',  async (req: Request, res: Response): Promise<void> => {
    try {
      // Call the logout controller method
      const response = await UserController.logout(req, res);
  
      // Send the response without returning it
      res.status(response ? 200 : 400).json(response);
    } catch (error) {
      // Error handling
      res.status(500).json({
        success: false,
        message: 'Error during logout',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
// Get all users with pagination
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const response = await UserController.getAllUsers(req, res);
  res.status(response ? 200 : 400).json(response);
});

export default router;
