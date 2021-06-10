const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    return sequelize.define('faq', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        question: {
            type: Sequelize.STRING,
            allowNull: true
        },
        answer: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'faq'
    })
}