const database = require('knex')({
  client: process.env.DB_PROVIDER,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_SECRET,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 10 },
})

module.exports = database
