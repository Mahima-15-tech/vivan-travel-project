const { Transaction } = require("sequelize")

module.exports = (sequelize, DataTypes) => {

    const Cancel = sequelize.define("cancel", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Booking_RefNo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cancel_api_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        upi: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        api_response: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Refund process",
        },
    });
    return Cancel
}