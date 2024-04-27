const mysql = require('mysql2');
//para las promesas
const { promisify } = require('util');

const { database } = require('./keys');

const pool = mysql.createPool({database,
    connectionLimit: 10, // Número máximo de conexiones en la pool
  waitForConnections: true, // Si la pool ha alcanzado su límite de conexiones, espera hasta que una conexión esté disponible
  queueLimit: 0 });

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection fue cerrada.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has to many connections');
        }
        //fue rechazada
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection fue rechazada');
        }
    }

    if (connection) {connection.release();
    console.log('DB esta conectada');
    }
    return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;