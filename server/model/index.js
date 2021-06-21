require('dotenv').config()
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST
})

const Payments = require('./payments')(sequelize)
const points = require('./points')(sequelize)

module.exports = {
    sequelize : sequelize,
    points : points,
    payments: Payments
}