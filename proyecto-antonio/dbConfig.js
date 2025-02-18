const { Pool } = require("pg");
const connectionString = `postgresql://user:password@localhost/mydatabase`;

const pool = new Pool({
    connectionString
});

module.exports = { pool };