import knex from '../db/db'; // Ensure your knex instance is imported
import bcrypt from 'bcrypt'; // For password hashing
import { Knex } from 'knex';

interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  full_name: string;
  gender: string;  // New field added
}

interface Response {
  success: boolean;
  message: string;
  data?: any;
}

class UserModel {
  // Register a new user
  static async register(user: User): Promise<Response> {
    const { username, email, password, full_name, gender } = user;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await knex('users').insert({
        username,
        email,
        password: hashedPassword,
        full_name,
        gender,
      });

      return {
        success: true,
        message: 'User registered successfully',
        data: { id: result[0] }, // Assuming result returns an array with the inserted ID
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error while registering user',
      };
    }
  }

  // Login a user (verify credentials)
  static async login(email: string, password: string): Promise<Response> {
    try {
      // Get user by email
      const user = await knex('users').where('email', email).first();
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Compare the password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      return {
        success: true,
        message: 'Login successful',
        data: user, // Return the user object
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error while logging in',
      };
    }
  }

  // Get a user by ID (can be used for other activities)
  static async getUserById(id: number): Promise<Response> {
    try {
      const user = await knex('users').where('id', id).first();
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error retrieving user data',
      };
    }
  }

  // Example: update user profile activity
  static async updateUserActivity(id: number, activity: string): Promise<Response> {
    try {
      const result = await knex('user_activities').insert({
        user_id: id,
        activity,
        timestamp: knex.fn.now(),
      });

      return {
        success: true,
        message: 'User activity updated successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error updating user activity',
      };
    }
  }

  // Example: get all user activities
  static async getUserActivities(id: number): Promise<Response> {
    try {
      const activities = await knex('user_activities').where('user_id', id);
      return {
        success: true,
        message: 'User activities retrieved successfully',
        data: activities,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error retrieving user activities',
      };
    }
  }
}

export default UserModel;
