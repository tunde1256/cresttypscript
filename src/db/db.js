"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dbConfig = {
    client: 'pg', // Change to 'mysql' or 'mysql2' for MySQL databases
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Tunde@2024',
        database: 'crest',
    },
};
const db = (0, knex_1.default)(dbConfig);
exports.default = db;
