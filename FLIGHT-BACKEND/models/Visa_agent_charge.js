module.exports = (sequelize, DataTypes) => {

    const Visa_agent_charge = sequelize.define("visa_agent_charge", {

        visa_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: 0,
        },
        child_price: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: 0,
        },
    });

    return Visa_agent_charge

}