import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Alter the chat_messages table to add 'type' and 'receiver_id'
  await knex.schema.table("chat_messages", (table) => {
    table.string("type").notNullable(); // Add type column to store 'forum' or 'dm'
    table.string("receiver_id").nullable(); // Add receiver_id column for direct messages (nullable for forum messages)
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback the changes by dropping the 'type' and 'receiver_id' columns
  await knex.schema.table("chat_messages", (table) => {
    table.dropColumn("type");
    table.dropColumn("receiver_id");
  });
}
