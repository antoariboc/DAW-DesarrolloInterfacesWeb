const { Pool } = require("pg");
//Creamos la cadena para la connexion a la base de datos
const connectionString = `postgresql://user:password@proyecto-antonio-db-1/mydatabase`;

const pool = new Pool({
    connectionString
});

module.exports = { pool };