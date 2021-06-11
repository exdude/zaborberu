const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    return sequelize.define('payments', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        customOrderNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        orderNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        count: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        delivery: {
            type: Sequelize.STRING,
            allowNull: true
        },
        date: {
            type: Sequelize.STRING,
            allowNull: true
        },
        orderId: {
            type: Sequelize.STRING,
            allowNull: true
        },
        qrOrderId: {
            type: Sequelize.STRING,
            allowNull: true
        },
        url: {
            type: Sequelize.STRING,
            allowNull: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true
        },
        FZ: {
            type: Sequelize.STRING,
            allowNull: true
        },
        FZ_ID: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'payments'
    })
}