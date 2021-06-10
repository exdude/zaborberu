const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    return sequelize.define('assorty', {
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
        category: {
            type: Sequelize.STRING,
            allowNull: true
        },
        color: {
            type: Sequelize.STRING,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        size: {
            type: Sequelize.STRING,
            allowNull: true
        },
        edge: {
            type: Sequelize.STRING,
            allowNull: true
        },
        plank: {
            type: Sequelize.STRING,
            allowNull: true
        },
        time: {
            type: Sequelize.STRING,
            allowNull: true
        },
        count: {
            type: Sequelize.STRING,
            allowNull: true
        },
        scheme: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'assorty'
    })
}