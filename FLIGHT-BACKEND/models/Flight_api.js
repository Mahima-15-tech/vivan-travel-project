module.exports = (sequelize, DataTypes) => {

    const Flight_api = sequelize.define("Flight_api", {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Active",
        },

    });

    return Flight_api

}