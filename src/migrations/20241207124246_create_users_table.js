"use strict";
// knexfile.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the 'users' table
        yield knex.schema.createTable('users', (table) => {
            table.increments('id').primary(); // Primary key, auto-incremented
            table.string('username').notNullable().unique(); // Unique username
            table.string('email').notNullable().unique(); // Unique email
            table.string('password').notNullable(); // Password field
            table.string('full_name').notNullable(); // Full name of the user
            table.enu('gender', ['Male', 'Female', 'Other']).notNullable(); // Gender field, with possible values
            table.timestamps(true, true); // Created_at and updated_at timestamps
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Drop the 'users' table
        yield knex.schema.dropTableIfExists('users');
    });
}
