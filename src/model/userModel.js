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
class UserModel {
    // Register a new user
    static register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, full_name, gender } = user;
            // Hash the password before saving
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            try {
                const result = yield (0, db_1.default)('users').insert({
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
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error while registering user',
                };
            }
        });
    }
    // Login a user (verify credentials)
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get user by email
                const user = yield (0, db_1.default)('users').where('email', email).first();
                if (!user) {
                    return {
                        success: false,
                        message: 'User not found',
                    };
                }
                // Compare the password with the stored hash
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
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
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error while logging in',
                };
            }
        });
    }
    // Get a user by ID (can be used for other activities)
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, db_1.default)('users').where('id', id).first();
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
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error retrieving user data',
                };
            }
        });
    }
    // Example: update user profile activity
    static updateUserActivity(id, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, db_1.default)('user_activities').insert({
                    user_id: id,
                    activity,
                    timestamp: db_1.default.fn.now(),
                });
                return {
                    success: true,
                    message: 'User activity updated successfully',
                    data: result,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error updating user activity',
                };
            }
        });
    }
    // Example: get all user activities
    static getUserActivities(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activities = yield (0, db_1.default)('user_activities').where('user_id', id);
                return {
                    success: true,
                    message: 'User activities retrieved successfully',
                    data: activities,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error retrieving user activities',
                };
            }
        });
    }
}
exports.default = UserModel;
