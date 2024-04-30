const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 48466;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'iGaieNNpqvbdvplZSyJHsmTmDsXudFdP';
const DB_HOST = process.env.DB_HOST || 'monorail.proxy.rlwy.net';
const DB_DATABASE = process.env.DB_DATABASE || 'railway';
const DB_PORT = process.env.DB_PORT || 48466;

module.exports = {
    PORT,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DATABASE,
    DB_PORT
  };