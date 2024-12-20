"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const config = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.MYSQL_HOST || 'localhost', // Reference the environment variable directly
            user: process.env.MYSQL_USER || 'root', // Reference the environment variable directly
            password: process.env.MYSQL_PASSWORD || 'Tunde@2024', // Reference the environment variable directly
            database: process.env.MYSQL_DATABASE || 'crest', // Reference the environment variable directly
        },
        migrations: {
            directory: './src/migrations',
        },
        seeds: {
            directory: './src/seeds',
        },
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map