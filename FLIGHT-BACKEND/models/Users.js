const { language } = require(".")

module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("users", {
        name: {
            type: DataTypes.STRING,
        },
        mobile_no: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        email_verify: {
            type: DataTypes.INTEGER,
        },
        password: {
            type: DataTypes.STRING,
        },
        dob: {
            type: DataTypes.DATEONLY,
        },
        address: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        currency_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lat: {
            type: DataTypes.STRING,
        },
        lng: {
            type: DataTypes.STRING,
        },
        profile_photo: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.STRING,
        },
        language: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
        fcm: {
            type: DataTypes.STRING,
            allowNull: true
        },
        wallet: {
            type: DataTypes.STRING,
            defaultValue: '0',
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: '1',
        },
    })

    return Users
}

