const { Pool } = require('pg');
require('dotenv').config()

const { connectionString } = process.env;

const pool = new Pool({ connectionString });

pool.on('connect', () => {
  console.log('DB connected');
});

pool.on('error', (err) => {
  console.log('DB connection failed', { err });
});

module.exports = { pool };
