const mysql = require('mysql2');
//para las promesas
const { promisify } = require('util');

const { database } = require('./keys');
console.log('estamos en database')

const pool = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',
  user: 'root',
  password: 'iGaieNNpqvbdvplZSyJHsmTmDsXudFdP',
  database: 'railway',
  port:48466,
   });
  //console.log(pool);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection fue cerrada.');
            console.log('error1');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has to many connections');
            console.log('error2');
        }
        //fue rechazada
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection fue rechazada');
            console.log('error3');
        }
    }

    if (connection) {connection.release();
    console.log('DB esta conectada');
    }
    //console.log(err);
    //console.log(connection);
    return;
    
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;