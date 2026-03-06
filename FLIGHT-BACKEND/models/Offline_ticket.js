module.exports = (sequelize, DataTypes) => {

    const Offline_ticket = sequelize.define("offline_ticket", {
        airline: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        from: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        to: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        adult_price: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: 0,
        },
        child_price: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: 0,
        },
        infant_price: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: 0,
        },
        seat: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: 0,
        },
        flight_code: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "",
        },
        check_in_bag: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "",
        },
        cabin_in_bag: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "",
        },
        departure_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        arrived_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isrefundable: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Active",
        },
    });

    return Offline_ticket

}