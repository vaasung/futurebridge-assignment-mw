const {Client, Pool} = require('pg');

// must got to env
const connectionString = "postgres://ehkyzepv:d_n3cmdbG-v-8S68-bXAAy6Fd5UQNQLV@peanut.db.elephantsql.com/ehkyzepv";

const pool = new Pool (({connectionString}))

pool.on('connect', () => {
  console.log('DB connected')
})

pool.on('error', (err) => {
  console.log('DB connection failed', {err})
})

module.exports = { pool }