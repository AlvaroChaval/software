//dir de la db
import {
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD
} from './config.js'
module.exports = {

    database: {
        connectionLimit: 1000,
        host: DB_HOST,//'152.70.216.169',//'localhost', //'',
        port: DB_PORT,
        user: DB_USER,//
        password: DB_PASSWORD,//'151199',
        database: DB_DATABASE
        // connectionLimit: 100,
        // host: 'localhost',//'152.70.216.169',//'localhost', //'',
        // port: '3307',
        // user: 'root',
        // password: '1234',//'151199',
        // database: 'sw1pizarrac4'
    }
}