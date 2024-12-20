import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create the chat_messages table
  await knex.schema.createTable("chat_messages", (table) => {
    table.increments("id").primary(); // Auto-incrementing primary key
    table.string("username").notNullable(); // Store the sender's username
    table.text("text").notNullable(); // Store the message text
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(); // Store message creation timestamp
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the chat_messages table if rolling back
  await knex.schema.dropTableIfExists("chat_messages");
}
