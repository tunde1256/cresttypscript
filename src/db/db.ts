// src/knex.ts
import knexConfig from '../knexfile';  // Import knex configuration from knexfile.ts
import knex from 'knex';

// Get the current environment (default to 'development')
const environment = process.env.NODE_ENV || 'development';

// Create a Knex instance with the configuration for the current environment
const db = knex(knexConfig[environment]);

// Test the connection (raw SQL query to check the database connection)
db.raw('SELECT 1')
  .then(() => {
    console.log('Connected to the database successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.message);
  });

// Export the Knex instance for use in other parts of the application
export default db;
