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

db.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

export default db;
