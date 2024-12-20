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
const db_1 = __importDefault(require("../db/db")); // Ensure your knex instance is imported
const bcrypt_1 = __importDefault(require("bcrypt")); // For password hashing
const logger_1 = __importDefault(require("../logger")); // Import your logger
const cloudinary_1 = __importDefault(require("cloudinary")); // Cloudinary configuration
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    // Register a new user
    static register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, full_name, gender } = user;
            try {
                logger_1.default.info(`Attempting to register user: ${email}`);
                // Check if email already exists
                const existingUser = yield (0, db_1.default)('users').where('email', email).first();
                if (existingUser) {
                    logger_1.default.warn(`Registration failed: Email already exists (${email})`);
                    return {
                        success: false,
                        message: 'Email already exists',
                    };
                }
                // Hash the password before saving
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                // Insert the new user into the database
                const result = yield (0, db_1.default)('users').insert({
                    username,
                    email,
                    password: hashedPassword,
                    full_name,
                    gender,
                });
                logger_1.default.info(`User registered successfully: ${email}`);
                return {
                    success: true,
                    message: 'User registered successfully',
                    data: { id: result[0] }, // Assuming result returns an array with the inserted ID
                };
            }
            catch (error) {
                logger_1.default.error(`Error while registering user (${email}): ${error instanceof Error ? error.message : 'Unknown error'}`);
                return {
                    success: false,
                    message: 'Error while registering user',
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        });
    }
    // Login a user
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Attempting login for user: ${email}`);
                // Retrieve user by email
                const user = yield (0, db_1.default)('users').where('email', email).first();
                if (!user) {
                    logger_1.default.warn(`Login failed: User not found (${email})`);
                    return {
                        success: false,
                        message: 'User not found',
                    };
                }
                // Compare the input password with the stored hash
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!isMatch) {
                    logger_1.default.warn(`Login failed: Invalid credentials (${email})`);
                    return {
                        success: false,
                        message: 'Invalid credentials',
                    };
                }
                // Create a JWT token after successful login
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                }, process.env.JWT_SECRET, // Secret key from environment variable
                { expiresIn: '1h' } // Optional expiration time (e.g., 1 hour)
                );
                logger_1.default.info(`Login successful for user: ${email}`);
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
            }
            catch (error) {
                logger_1.default.error(`Error while logging in user (${email}): ${error instanceof Error ? error.message : 'Unknown error'}`);
                return {
                    success: false,
                    message: 'Error while logging in',
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        });
    }
    // Update user
    static updateUser(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Attempting to update user with ID: ${id}`);
                // Update the user record
                const result = yield (0, db_1.default)('users').where('id', id).update(updates);
                if (!result) {
                    logger_1.default.warn(`Update failed: User not found or no updates made (ID: ${id})`);
                    return {
                        success: false,
                        message: 'User not found or no updates made',
                    };
                }
                logger_1.default.info(`User updated successfully (ID: ${id})`);
                return {
                    success: true,
                    message: 'User updated successfully',
                };
            }
            catch (error) {
                logger_1.default.error(`Error while updating user (ID: ${id}): ${error instanceof Error ? error.message : 'Unknown error'}`);
                return {
                    success: false,
                    message: 'Error while updating user',
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        });
    }
    // Delete user
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Attempting to delete user with ID: ${id}`);
                // Delete the user record
                const result = yield (0, db_1.default)('users').where('id', id).del();
                if (!result) {
                    logger_1.default.warn(`Delete failed: User not found (ID: ${id})`);
                    return {
                        success: false,
                        message: 'User not found',
                    };
                }
                logger_1.default.info(`User deleted successfully (ID: ${id})`);
                return {
                    success: true,
                    message: 'User deleted successfully',
                };
            }
            catch (error) {
                logger_1.default.error(`Error while deleting user (ID: ${id}): ${error instanceof Error ? error.message : 'Unknown error'}`);
                return {
                    success: false,
                    message: 'Error while deleting user',
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        });
    }
    // Upload profile picture
    static uploadProfilePicture(id, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Uploading profile picture for user with ID: ${id}`);
                // Upload the file to Cloudinary
                const result = yield cloudinary_1.default.v2.uploader.upload(file.path, {
                    folder: 'profile_pictures',
                    public_id: `user_${id}`,
                    resource_type: 'image',
                });
                // Save the image URL to the user's profile in the database
                const updatedUser = yield (0, db_1.default)('users').where('id', id).update({
                    profile_picture: result.secure_url,
                });
                if (!updatedUser) {
                    logger_1.default.warn(`Failed to update profile picture for user with ID: ${id}`);
                    return {
                        success: false,
                        message: 'Failed to update profile picture',
                    };
                }
                logger_1.default.info(`Profile picture uploaded successfully for user with ID: ${id}`);
                return {
                    success: true,
                    message: 'Profile picture uploaded successfully',
                    data: { profile_picture: result.secure_url },
                };
            }
            catch (error) {
                logger_1.default.error(`Error while uploading profile picture for user with ID: ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                return {
                    success: false,
                    message: 'Error while uploading profile picture',
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        });
    }
    // Logout user (invalidate session or JWT)
    static logout(req, res) {
        try {
            logger_1.default.info(`Logging out user with ID: ${req.user.id}`); // Assuming `req.user.id` is populated from a JWT middleware
            // If the token is stored in a cookie, clear the cookie
            res.clearCookie('token'); // Adjust the cookie name if necessary
            // If using token invalidation (e.g., blacklisting), you could add logic here
            logger_1.default.info('User logged out successfully');
            return res.status(200).json({ success: true, message: 'Logged out successfully' });
        }
        catch (error) {
            logger_1.default.error(`Error while logging out user: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return res.status(500).json({ success: false, message: 'Error while logging out' });
        }
    }
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query; // Extract page and limit from query parameters (defaults to 1 and 10)
            try {
                logger_1.default.info(`Fetching users - Page: ${page}, Limit: ${limit}`);
                // Calculate the offset for pagination
                const offset = (Number(page) - 1) * Number(limit);
                // Retrieve users with pagination
                const users = yield (0, db_1.default)('users')
                    .limit(Number(limit))
                    .offset(offset);
                // Get the total number of users
                const totalUsers = yield (0, db_1.default)('users').count('* as count');
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
            }
            catch (error) {
                logger_1.default.error(`Error while fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`);
                return res.status(500).json({
                    success: false,
                    message: 'Error while fetching users',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        });
    }
}
exports.default = UserController;
