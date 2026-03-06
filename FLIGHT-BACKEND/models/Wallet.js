const { Transaction } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const wallet = sequelize.define("wallet", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transaction_fees: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transaction_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        payment_getway: {
            type: DataTypes.STRING,
            allowNull: true
        },
        payment_from: {
            type: DataTypes.STRING,
            allowNull: true
        },
        payment_to: {
            type: DataTypes.STRING,
            allowNull: true
        },
        source: {
            type: DataTypes.STRING,
            allowNull: true
        },
        details: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending'
        },
        
    })
    
    return wallet

}