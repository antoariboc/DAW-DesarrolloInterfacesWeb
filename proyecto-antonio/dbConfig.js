const { Pool } = require("pg");
const connectionString = `postgresql://user:password@proyecto-antonio-db-1/mydatabase`;

const pool = new Pool({
    connectionString
});

module.exports = { pool };