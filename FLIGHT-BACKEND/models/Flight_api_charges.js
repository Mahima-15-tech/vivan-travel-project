
module.exports = (sequelize, DataTypes) => {

    const Flight_api_charges = sequelize.define("Flight_api_charges", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        flight_api_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        amount: {
            type: DataTypes.DOUBLE(10, 2),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Active",
        },
    },
        {
            indexes: [
                {
                    unique: true,
                    fields: ["user_id", "flight_api_id"],
                },
            ],
        }
    );




    return Flight_api_charges

}