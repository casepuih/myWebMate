const mysql = require('mysql2/promise');
const {TasksDTO} = require("../dto/tasksDTO");

const { DB_SERVER, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_PORT } = process.env;

const sql = mysql.createConnection({
    host: DB_SERVER,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
});

module.exports = sql;
