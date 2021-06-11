require('dotenv')


const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.PRODUCT === "true" ? process.env.MYSQL_PASS : "",
    database: process.env.MYSQL_DB
})
const pool = connection.promise()
module.exports = async (s) => pool.query(s)