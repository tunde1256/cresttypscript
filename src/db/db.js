"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/knex.ts
const knexfile_1 = __importDefault(require("../knexfile")); // Import knex configuration from knexfile.ts
const knex_1 = __importDefault(require("knex"));
// Get the current environment (default to 'development')
const environment = process.env.NODE_ENV || 'development';
// Create a Knex instance with the configuration for the current environment
const db = (0, knex_1.default)(knexfile_1.default[environment]);
// Test the connection (raw SQL query to check the database connection)
db.raw('SELECT 1')
    .then(() => {
    console.log('Connected to the database successfully!');
})
    .catch((error) => {
    console.error('Error connecting to the database:', error.message);
});
// Export the Knex instance for use in other parts of the application
exports.default = db;
