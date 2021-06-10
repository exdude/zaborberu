const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    return sequelize.define('projects_eu', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        img: {
            type: Sequelize.STRING,
            allowNull: true
        },
        loc: {
            type: Sequelize.STRING,
            allowNull: true
        },
        color: {
            type: Sequelize.STRING,
            allowNull: true
        },
        height: {
            type: Sequelize.STRING,
            allowNull: true
        },
        width: {
            type: Sequelize.STRING,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        model: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'projects_eu'
    })
}