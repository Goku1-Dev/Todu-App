require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
connectionString: process.env.DATABASE_URI,
});

pool.query('SELECT NOW()', (err, res) => {
console.log(err, res);
pool.end();
});

module.exports = pool;