import knex from '../db/db'; // Ensure your knex instance is imported
import bcrypt from 'bcrypt'; // For password hashing
import logger from '../logger'; // Import your logger
import cloudinary from 'cloudinary'; // Cloudinary configuration
import upload from '../config/mutter'; // The upload middleware (multer + cloudinary)
import { Request, Response } from 'express'; // Add Express types for request and response
import jwt from 'jsonwebtoken';
interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  full_name: string;
  gender: string;
  profile_picture?: string; // Added profile_picture field
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
        user: User; // Assuming `User` is the interface that holds the user's data
      }
    }
  }

class UserController {
  // Register a new user
  static async register(user: User): Promise<ApiResponse> {
    const { username, email, password, full_name, gender }: User = user;

    try {
      logger.info(`Attempting to register user: ${email}`);
      
      // Check if email already exists
      const existingUser = await knex('users').where('email', email).first();
      if (existingUser) {
        logger.warn(`Registration failed: Email already exists (${email})`);
        return {
          success: false,
          message: 'Email already exists',
        };
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const result = await knex('users').insert({
        username,
        email,
        password: hashedPassword,
        full_name,
        gender,
      });

      logger.info(`User registered successfully: ${email}`);
      return {
        success: true,
        message: 'User registered successfully',
        data: { id: result[0] }, // Assuming result returns an array with the inserted ID
      };
    } catch (error) {
      logger.error(`Error while registering user (${email}): ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: 'Error while registering user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Login a user
  static async login(email: string, password: string): Promise<ApiResponse> {
    try {
      logger.info(`Attempting login for user: ${email}`);
      
      // Retrieve user by email
      const user = await knex('users').where('email', email).first();
      if (!user) {
        logger.warn(`Login failed: User not found (${email})`);
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Compare the input password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn(`Login failed: Invalid credentials (${email})`);
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Create a JWT token after successful login
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET as string, // Secret key from environment variable
        { expiresIn: '1h' } // Optional expiration time (e.g., 1 hour)
      );

      logger.info(`Login successful for user: ${email}`);
      return {
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          token, // Return the generated token
        },
      };
    } catch (error) {
      logger.error(`Error while logging in user (${email}): ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: 'Error while logging in',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Update user
  static async updateUser(id: number, updates: Partial<User>): Promise<ApiResponse> {
    try {
      logger.info(`Attempting to update user with ID: ${id}`);
      
      // Update the user record
      const result = await knex('users').where('id', id).update(updates);
      if (!result) {
        logger.warn(`Update failed: User not found or no updates made (ID: ${id})`);
        return {
          success: false,
          message: 'User not found or no updates made',
        };
      }

      logger.info(`User updated successfully (ID: ${id})`);
      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      logger.error(`Error while updating user (ID: ${id}): ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: 'Error while updating user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Delete user
  static async deleteUser(id: number): Promise<ApiResponse> {
    try {
      logger.info(`Attempting to delete user with ID: ${id}`);
      
      // Delete the user record
      const result = await knex('users').where('id', id).del();
      if (!result) {
        logger.warn(`Delete failed: User not found (ID: ${id})`);
        return {
          success: false,
          message: 'User not found',
        };
      }

      logger.info(`User deleted successfully (ID: ${id})`);
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      logger.error(`Error while deleting user (ID: ${id}): ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: 'Error while deleting user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(id: number, file: Express.Multer.File): Promise<ApiResponse> {
    try {
      logger.info(`Uploading profile picture for user with ID: ${id}`);

      // Upload the file to Cloudinary
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'profile_pictures',
        public_id: `user_${id}`,
        resource_type: 'image',
      });

      // Save the image URL to the user's profile in the database
      const updatedUser = await knex('users').where('id', id).update({
        profile_picture: result.secure_url,
      });

      if (!updatedUser) {
        logger.warn(`Failed to update profile picture for user with ID: ${id}`);
        return {
          success: false,
          message: 'Failed to update profile picture',
        };
      }

      logger.info(`Profile picture uploaded successfully for user with ID: ${id}`);
      return {
        success: true,
        message: 'Profile picture uploaded successfully',
        data: { profile_picture: result.secure_url },
      };
    } catch (error) {
      logger.error(`Error while uploading profile picture for user with ID: ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: 'Error while uploading profile picture',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Logout user (invalidate session or JWT)
  static logout(req: Request, res: Response): Response {
    try {
      logger.info(`Logging out user with ID: ${req.user.id}`); // Assuming `req.user.id` is populated from a JWT middleware
      
      // If the token is stored in a cookie, clear the cookie
      res.clearCookie('token'); // Adjust the cookie name if necessary

      // If using token invalidation (e.g., blacklisting), you could add logic here

      logger.info('User logged out successfully');
      return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      logger.error(`Error while logging out user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return res.status(500).json({ success: false, message: 'Error while logging out' });
    }
  }
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    const { page = 1, limit = 10 } = req.query; // Extract page and limit from query parameters (defaults to 1 and 10)
    try {
      logger.info(`Fetching users - Page: ${page}, Limit: ${limit}`);

      // Calculate the offset for pagination
      const offset = (Number(page) - 1) * Number(limit);

      // Retrieve users with pagination
      const users = await knex('users')
        .limit(Number(limit))
        .offset(offset);

      // Get the total number of users
      const totalUsers = await knex('users').count('* as count');

      // Prepare the response object
      return res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: {
          users,
          total: totalUsers[0].count,
          page: Number(page),
          limit: Number(limit),
        },
      });
    } catch (error) {
      logger.error(`Error while fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return res.status(500).json({
        success: false,
        message: 'Error while fetching users',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

}

export default UserController;
