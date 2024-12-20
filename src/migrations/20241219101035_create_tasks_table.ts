import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary(); // Primary key
    table.string('title').notNullable(); // Task title
    table.text('description').notNullable(); // Task description
    table.integer('user_id').unsigned().notNullable(); // Reference to user
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE'); // Foreign key constraint
    table.timestamps(true, true); // Created at and updated at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tasks');
}
