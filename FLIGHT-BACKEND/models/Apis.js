const { account_login } = require("../controllers/userController")
const { status } = require("../helpers/validation")

module.exports = (sequelize, DataTypes) => {

    const apis = sequelize.define("apis", {
        api_key: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Authorization: {
            type: DataTypes.STRING,
            allowNull: false
        },
        base_url: {
            type: DataTypes.STRING,
        },
        api_type: {
            type: DataTypes.STRING,
        },
        token_type: {
            type: DataTypes.STRING,
        },
        party_name: {
            type: DataTypes.STRING,
        },
        data_passing_type: {
            type: DataTypes.STRING,
        },
        link: {
            type: DataTypes.STRING,
        },
        account_login_name: {
            type: DataTypes.STRING,
        },
        account_login_password: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
    }) 
    return apis
}