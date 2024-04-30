//dir de la db
const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = require('./config');

module.exports = {

    database: {
        //connectionLimit: 1000,
        host: 'monorail.proxy.rlwy.net',//'152.70.216.169',//'localhost', //'',
        port: 48466,
        user: 'root',//
        password: 'iGaieNNpqvbdvplZSyJHsmTmDsXudFdP',//'151199',
        database: 'railway'
        // connectionLimit: 100,
        // host: 'localhost',//'152.70.216.169',//'localhost', //'',
        // port: '3307',
        // user: 'root',
        // password: '1234',//'151199',
        // database: 'sw1pizarrac4'
    }
}