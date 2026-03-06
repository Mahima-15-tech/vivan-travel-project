module.exports = (sequelize, DataTypes) => {

    const contactsupport = sequelize.define("contactsupport", {
        support_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        subject: {
            type: DataTypes.STRING,
        },
        message: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
    }) 

    return contactsupport

}