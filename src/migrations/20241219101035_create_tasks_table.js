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
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.createTable('tasks', (table) => {
            table.increments('id').primary(); // Primary key
            table.string('title').notNullable(); // Task title
            table.text('description').notNullable(); // Task description
            table.integer('user_id').unsigned().notNullable(); // Reference to user
            table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE'); // Foreign key constraint
            table.timestamps(true, true); // Created at and updated at
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTableIfExists('tasks');
    });
}
