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
        // Create the chat_messages table
        yield knex.schema.createTable("chat_messages", (table) => {
            table.increments("id").primary(); // Auto-incrementing primary key
            table.string("username").notNullable(); // Store the sender's username
            table.text("text").notNullable(); // Store the message text
            table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(); // Store message creation timestamp
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Drop the chat_messages table if rolling back
        yield knex.schema.dropTableIfExists("chat_messages");
    });
}
