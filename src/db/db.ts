import knex from 'knex';

const dbConfig = {
  client: 'pg',    // Change to 'mysql' or 'mysql2' for MySQL databases
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Tunde@2024',
    database: 'crest',
  },
};

const db = knex(dbConfig);

export default db;
