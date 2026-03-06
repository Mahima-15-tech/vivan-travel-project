const { country } = require(".")

module.exports = (sequelize, DataTypes) => {

    const Oktb = sequelize.define("oktb", {
        refrense_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pnr: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dob: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passport_font_side: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passport_back_side: {
            type: DataTypes.STRING,
            allowNull: true
        },
        visa: {
            type: DataTypes.STRING,
            allowNull: true
        },
        from_ticket: {
            type: DataTypes.STRING,
            allowNull: true
        },
        to_ticket: {
            type: DataTypes.STRING,
            allowNull: true
        },
        airlines: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        group_zip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'In Process'
        },
        otb_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        working_status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'In Process'
        },
        created_file: {
            type: DataTypes.STRING,
            allowNull: true
        },
    })

    return Oktb
}