const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    return sequelize.define('action', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        icon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        base: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'action'
    })
}