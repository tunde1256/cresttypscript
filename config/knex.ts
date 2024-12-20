import knex from 'knex';

const db = knex({
  client: 'mysql', 
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Tunde@2024',
    database: 'crest',
  },
});

export default db;
