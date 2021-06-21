const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    return sequelize.define('points', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        schedule: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phones: {
            type: Sequelize.STRING,
            allowNull: true
        },
        coords: {
            type: Sequelize.STRING,
            allowNull: true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'points'
    })
}