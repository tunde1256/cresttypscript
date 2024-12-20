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
        // Alter the chat_messages table to add 'type' and 'receiver_id'
        yield knex.schema.table("chat_messages", (table) => {
            table.string("type").notNullable(); // Add type column to store 'forum' or 'dm'
            table.string("receiver_id").nullable(); // Add receiver_id column for direct messages (nullable for forum messages)
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Rollback the changes by dropping the 'type' and 'receiver_id' columns
        yield knex.schema.table("chat_messages", (table) => {
            table.dropColumn("type");
            table.dropColumn("receiver_id");
        });
    });
}
