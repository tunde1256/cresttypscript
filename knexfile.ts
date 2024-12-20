module.exports = {
  client: 'mysql', // Use lowercase 'mysql'
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Tunde@2024',
    database: 'crest',
  },
  migrations: {
    directory: './src/migrations', // Path where migration files are stored
  },
};
