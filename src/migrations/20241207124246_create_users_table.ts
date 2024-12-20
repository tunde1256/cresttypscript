// knexfile.ts

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the 'users' table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // Primary key, auto-incremented
    table.string('username').notNullable().unique(); // Unique username
    table.string('email').notNullable().unique(); // Unique email
    table.string('password').notNullable(); // Password field
    table.string('full_name').notNullable(); // Full name of the user
    table.enu('gender', ['Male', 'Female', 'Other']).notNullable(); // Gender field, with possible values
    table.timestamps(true, true); // Created_at and updated_at timestamps
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the 'users' table
  await knex.schema.dropTableIfExists('users');
}
