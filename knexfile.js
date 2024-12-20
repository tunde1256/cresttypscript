"use strict";
// knexfile.js
module.exports = {
    client: 'mysql2', // or 'pg' for PostgreSQL
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Tunde@2024',
        database: 'crest',
    },
    migrations: {
        directory: './migrations', // Ensure this directory exists
        tableName: 'knex_migrations',
    },
    seeds: {
        directory: './seeds',
    },
};
